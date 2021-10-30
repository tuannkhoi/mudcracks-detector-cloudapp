import cv2
import numpy as np
from PIL import Image
from flask import Flask, jsonify, request
from urllib.parse import unquote
import predict
import asyncio

model = predict.get_model()

def drawBoundingBox(path, predictions):
    image_cv = cv2.imread(path)
    HEIGHT, WIDTH, channels = image_cv.shape
    for i in range(len(predictions)):
        print(predictions[i], "\n")
        # TESTING#
        x1, y1 = predictions[i]['boundingBox']['left'], predictions[i]['boundingBox']['top']
        x2, y2 = x1 + predictions[i]['boundingBox']['width'], y1 + predictions[i]['boundingBox']['height']
        x1, y1, x2, y2 = round(x1 * WIDTH), round(y1 * HEIGHT), round(x2 * WIDTH), round(y2 * HEIGHT)

        image_cv = cv2.rectangle(image_cv, (x1, y1), (x2, y2), color=(0, 0, 0), thickness=3)

        # show_names and show_percentage:
        label = "%s : %.3f" % (predictions[i]['tagName'], predictions[i]['probability'])

        b = np.array([x1, y1, x2, y2]).astype(int)
        cv2.putText(image_cv, label, (b[0], b[1] - 10), cv2.FONT_HERSHEY_PLAIN, 1, (100, 0, 0), 3)
        cv2.putText(image_cv, label, (b[0], b[1] - 10), cv2.FONT_HERSHEY_PLAIN, 1, (255, 255, 255), 1)

    cv2.imwrite(path, image_cv) # Replace the current image at existing path with the new one (with bounding box)

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return 'Mud cracks detector - Flask server'

@app.route('/predict', methods=['GET', 'POST'])
async def infer_image():
    # Get image path from request
    path = request.args.get('imagePath')

    # Read image from path
    img = Image.open(path)

    asyncio.sleep(3)

    # ML model predict the image
    predictions = model.predict_image(img)
    print(predictions)

    asyncio.sleep(3)

    # Draw bounding box for the image
    # The new image (with bounding box) will replace the current one at path
    drawBoundingBox(path, predictions)

    asyncio.sleep(3)

    # Return the predictions
    return jsonify(predictions)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')