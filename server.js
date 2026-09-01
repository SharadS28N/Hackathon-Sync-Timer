const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const SECRET_KEY = 'super_secret_hackathon_key';

// In-memory state for the timer
let totalDuration = 24 * 3600; // default 24 hours
let remainingTime = 24 * 3600;
let isRunning = false;
let lastUpdate = Date.now();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple auth route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'hack' && password === 'hack') {
        const token = jwt.sign({ admin: true }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Admin panel route
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'backend.html'));
});

// Verify JWT for socket connections
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (socket.handshake.query.admin === 'true') {
        if (!token) return next(new Error("Authentication error"));
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return next(new Error("Authentication error"));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(); // allow public clients
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send initial state to the new client
    socket.emit('tick', { currentRemaining: remainingTime, totalDuration, isRunning });

    // Handle admin commands
    if (socket.handshake.query.admin === 'true') {
        socket.on('start', () => {
            if (!isRunning && remainingTime > 0) {
                isRunning = true;
                lastUpdate = Date.now();
            }
        });

        socket.on('pause', () => {
            if (isRunning) {
                const now = Date.now();
                const elapsed = Math.floor((now - lastUpdate) / 1000);
                remainingTime = Math.max(0, remainingTime - elapsed);
                isRunning = false;
            }
            io.emit('tick', { currentRemaining: remainingTime, totalDuration, isRunning });
        });

        socket.on('reset', () => {
            isRunning = false;
            remainingTime = totalDuration;
            io.emit('tick', { currentRemaining: remainingTime, totalDuration, isRunning });
        });

        socket.on('set_timer', (data) => {
            const { seconds } = data;
            if (seconds > 0) {
                totalDuration = seconds;
                remainingTime = seconds;
                isRunning = false;
                io.emit('tick', { currentRemaining: remainingTime, totalDuration, isRunning });
            }
        });
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Timer Loop
setInterval(() => {
    if (isRunning) {
        const now = Date.now();
        const elapsed = Math.floor((now - lastUpdate) / 1000);
        
        if (elapsed >= 1) {
            remainingTime = Math.max(0, remainingTime - elapsed);
            lastUpdate = now;
            
            io.emit('tick', { currentRemaining: remainingTime, totalDuration, isRunning });
            
            if (remainingTime === 0) {
                isRunning = false;
                io.emit('tick', { currentRemaining: 0, totalDuration, isRunning: false });
            }
        }
    }
}, 500);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
