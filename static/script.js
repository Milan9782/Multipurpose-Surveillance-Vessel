// ESP32 Command Sender
const ESP32_URL = "http://192.168.1.100/control"; // Adjust to your ESP32 IP

function sendCommand(command) {
    fetch(`${ESP32_URL}?command=${command}`)
        .then(() => {
            document.getElementById("boatStatus").innerText = command.toUpperCase();
            updateStatus(true); // mark online on success
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("boatStatus").innerText = "ERROR";
            updateStatus(false); // mark offline on error
        });
}

// Toggle switch handler
const toggleSwitch = document.querySelector('.toggle-switch');
if (toggleSwitch) {
    toggleSwitch.addEventListener('click', () => {
        toggleSwitch.classList.toggle('active');
        const isActive = toggleSwitch.classList.contains('active');
        sendCommand(isActive ? "start" : "stop");
    });
}

// Radar Threat Simulation
function updateRadarData() {
    const radarDisplay = document.getElementById("radarData");
    const isThreat = Math.random() > 0.7;

    if (isThreat) {
        radarDisplay.innerHTML = `
            <p style="color: red;">🚨 High Threat</p>
            <p style="color: orange;">⚠️ Medium Threat</p>
        `;
    } else {
        radarDisplay.innerHTML = `<p style="color: lightgreen;">✅ All Clear</p>`;
    }

    // Animate radar pulse (optional)
    radarDisplay.style.opacity = 0.5;
    setTimeout(() => radarDisplay.style.opacity = 1, 300);
}
setInterval(updateRadarData, 3000);

// YOLOv8 Status Text
document.addEventListener("DOMContentLoaded", () => {
    const aiDetection = document.getElementById("aiDetection");
    if (aiDetection) {
        aiDetection.innerText = "Live YOLOv8 feed running via Python backend...";
    }

    // Optional: hide unused canvas
    const canvas = document.getElementById("canvas");
    if (canvas) {
        canvas.style.display = "none";
    }
});

// Status Light Indicator
function updateStatus(isOnline) {
    const statusLight = document.getElementById('statusLight');
    if (statusLight) {
        statusLight.className = 'status-indicator ' + (isOnline ? 'status-online' : 'status-offline');
    }
}

// Control Buttons
document.getElementById('startBtn')?.addEventListener('click', () => sendCommand('start'));
document.getElementById('stopBtn')?.addEventListener('click', () => sendCommand('stop'));
document.getElementById('captureBtn')?.addEventListener('click', () => captureFrame());

// Canvas Example for Capture
function captureFrame() {
    const canvas = document.getElementById('videoCanvas');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    context.fillStyle = "#28a745"; // Simulated content
    context.fillRect(0, 0, canvas.width, canvas.height);

    const image = canvas.toDataURL("image/png");
    console.log("Captured frame:", image);
}
