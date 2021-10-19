
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

@app.route('/predict', methods=['GET'])
def infer_image():
    if 'file' not in request.files:
        return "Please try again. The Image doesn't exist"
    
    file = request.files.get('file')

    if not file:
        return

    img_bytes = file.read()
    img = Image.open(io.BytesIO(img_bytes))


    return jsonify(prediction=predict_result(img))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')