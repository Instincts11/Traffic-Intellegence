import os
import json
import sys

VEHICLE_CLASS_IDS = {1, 2, 3, 5, 7}


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "usage: yolo_cli.py input output"}))
        sys.exit(1)

    source = sys.argv[1]
    dest = sys.argv[2]

    try:
        from ultralytics import YOLO
    except Exception as e:
        print(json.dumps({"error": f"YOLO not installed: {e}"}))
        sys.exit(1)

    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    weights = os.path.join(base, "models", "yolov8n.pt")
    model = YOLO(weights if os.path.isfile(weights) else "yolov8n.pt")
    results = model(source)[0]
    boxes = results.boxes
    if boxes is None or len(boxes) == 0:
        count = 0
    else:
        class_ids = boxes.cls.cpu().numpy().astype(int)
        count = int(sum(c in VEHICLE_CLASS_IDS for c in class_ids))

    annotated = results.plot()
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        import cv2

        cv2.imwrite(dest, annotated)
    except Exception:
        from PIL import Image

        Image.fromarray(annotated[:, :, ::-1]).save(dest)

    print(json.dumps({"vehicle_count": count}))


if __name__ == "__main__":
    main()
