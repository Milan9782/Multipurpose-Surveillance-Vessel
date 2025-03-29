const ESP32_URL = "http://192.168.1.100/control";

function sendCommand(command) {
    fetch(`${ESP32_URL}?command=${command}`)
        .then(() => {
            document.getElementById("boatStatus").innerText = command.toUpperCase();
        })
        .catch(error => console.error("Error:", error));
}

function updateRadarData() {
    const radarDisplay = document.getElementById("radarData");
    let threats = Math.random() > 0.7 ? ["🚨 High Threat", "⚠️ Medium Threat"] : ["✅ All Clear"];
    radarDisplay.innerHTML = threats.map(threat => `<p>${threat}</p>`).join("");
}
setInterval(updateRadarData, 3000);

async function runObjectDetection() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const model = await cocoSsd.load();
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    async function detectObjects() {
        const predictions = await model.detect(video);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        document.getElementById("aiDetection").innerText = 
            predictions.length ? `Detected: ${predictions.map(p => p.class).join(", ")}` : "No objects detected";
        setTimeout(detectObjects, 1000);
    }
    detectObjects();
}
runObjectDetection();
