from flask import Flask, render_template, Response, request
from ultralytics import YOLO
import cv2

## activate venv if needed  process.run dg"venv/Scripts/activate."
app = Flask(__name__)
model = YOLO('yolov8n.pt')  # Make sure yolov8n.pt is in the same folder
cap = cv2.VideoCapture(0)

# Generator for streaming video frames
def generate_frames():
    while True:
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)
        for r in results:
            for box in r.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                label = f"{model.names[cls]} {conf:.2f}"
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Endpoint to serve video
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Endpoint to receive control commands
@app.route('/command', methods=['POST'])
def receive_command():
    cmd = request.json.get('command')
    print(f"Received command: {cmd}")
    # TODO: Send to ESP32 (via serial or HTTP)
    return {"status": "ok"}

@app.route('/')
def control_page():
    return render_template("control.html")

if __name__ == '__main__':
    app.run(debug=True)
