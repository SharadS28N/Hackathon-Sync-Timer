// UI Elements
const loginContainer = document.getElementById('login-container');
const controlContainer = document.getElementById('control-container');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const adminTimer = document.getElementById('admin-timer');
const statusText = document.getElementById('status-text');

// Buttons
const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnLogout = document.getElementById('btn-logout');
const btnSetTimer = document.getElementById('btn-set-timer');
const inputHours = document.getElementById('input-hours');
const inputMinutes = document.getElementById('input-minutes');

let token = localStorage.getItem('hackathon_admin_token');
let socket;

if (token) {
    connectSocket();
} else {
    showLogin();
}

function showLogin() {
    loginContainer.style.display = 'block';
    controlContainer.style.display = 'none';
}

function showControlPanel() {
    loginContainer.style.display = 'none';
    controlContainer.style.display = 'block';
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
        h.toString().padStart(2, '0'),
        m.toString().padStart(2, '0'),
        s.toString().padStart(2, '0')
    ].join(':');
}

function connectSocket() {
    socket = io({
        query: { admin: 'true' },
        auth: { token }
    });

    socket.on('connect_error', (err) => {
        token = null;
        localStorage.removeItem('hackathon_admin_token');
        showLogin();
    });

    socket.on('connect', () => {
        showControlPanel();
    });

    socket.on('tick', (state) => {
        adminTimer.textContent = formatTime(state.currentRemaining);
        statusText.textContent = state.isRunning ? 'RUNNING' : 'PAUSED';
        statusText.style.color = state.isRunning ? '#ffffff' : '#666666';
    });
}

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            token = data.token;
            localStorage.setItem('hackathon_admin_token', token);
            loginError.style.display = 'none';
            connectSocket();
        } else {
            loginError.style.display = 'block';
        }
    } catch (err) {
        loginError.style.display = 'block';
    }
});

// Controls
btnStart.addEventListener('click', () => {
    if (socket) socket.emit('start');
});

btnPause.addEventListener('click', () => {
    if (socket) socket.emit('pause');
});

btnReset.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the timer to its original duration?')) {
        if (socket) socket.emit('reset');
    }
});

btnSetTimer.addEventListener('click', () => {
    const hours = parseInt(inputHours.value) || 0;
    const minutes = parseInt(inputMinutes.value) || 0;
    const seconds = (hours * 3600) + (minutes * 60);

    if (seconds > 0 && confirm(`Set timer to ${hours} hours and ${minutes} minutes?`)) {
        if (socket) socket.emit('set_timer', { seconds });
    }
});

btnLogout.addEventListener('click', () => {
    token = null;
    localStorage.removeItem('hackathon_admin_token');
    if (socket) socket.disconnect();
    loginForm.reset();
    showLogin();
});
