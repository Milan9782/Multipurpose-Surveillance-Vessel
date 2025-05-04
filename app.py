from flask import Flask, render_template, Response, request, jsonify
from ultralytics import YOLO
import cv2

app = Flask(__name__)

# Load YOLO model (ensure yolov8n.pt is in the working directory)
model = YOLO('yolov8n.pt')

# Initialize video capture from webcam
cap = cv2.VideoCapture(0)

# Home route
@app.route('/')
def control_page():
    return render_template('control.html')

# Generator function for streaming frames
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

        # Encode and yield frame
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Route for video stream
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# Route for receiving commands (e.g. from buttons)
@app.route('/command', methods=['POST'])
def receive_command():
    data = request.get_json()
    cmd = data.get('command')
    print(f"Received command: {cmd}")
    
    # TODO: Send command to ESP32 here (e.g., via serial or HTTP)
    
    return jsonify({"status": "ok", "command": cmd})

if __name__ == '__main__':
    app.run(debug=True)
