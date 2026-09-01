const socket = io();

const timerElement = document.getElementById('timer');
const maskCircle = document.getElementById('mask-circle');
const totalDash = 283;

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

socket.on('tick', (state) => {
    timerElement.textContent = formatTime(state.currentRemaining);
    
    const percentage = state.totalDuration > 0 ? (state.currentRemaining / state.totalDuration) : 0;
    const offset = totalDash - (percentage * totalDash);
    maskCircle.style.strokeDashoffset = offset;
});
