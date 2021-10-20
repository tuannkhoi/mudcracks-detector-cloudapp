
import io
import string
import time
import os
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, jsonify, request
import predict

#reference: https://towardsdatascience.com/how-to-build-a-machine-learning-api-using-flask-2fb345518801

model = predict.get_model()

def predict_result(img):
    return model.predict_image(img)

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return 'Mud cracks detector - Flask server'

@app.route('/predict', methods=['GET', 'POST'])
def infer_image():
    # # ! Case 1: Receive an image file
    # # Catch the image from a request
    # if 'file' not in request.files:
    #     return "Please try again. The Image doesn't exist"
    
    # file = request.files.get('file')

    # if not file:
    #     return

    # # Read the image
    # img_bytes = file.read()

    # # Prepare the image 
    # img = Image.open(io.BytesIO(img_bytes))
    # ! Case 2: Receive an image path
    path = request.args.get('imagePath')
    # print(path)
    img = Image.open(path)
    # Return as a JSON format
    result = predict_result(img)
    # print(type(result))
    # print(result)
    # return jsonify(prediction=predict_result(img))
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')