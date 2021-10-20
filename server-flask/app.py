from PIL import Image
from flask import Flask, jsonify, request
import predict

#reference: https://towardsdatascience.com/how-to-build-a-machine-learning-api-using-flask-2fb345518801

model = predict.get_model()

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return 'Mud cracks detector - Flask server'

@app.route('/predict', methods=['GET', 'POST'])
def infer_image():
    # Get image path from request
    path = request.args.get('imagePath')

    # Read image from path
    img = Image.open(path)

    # Return prediction results as JSON
    return jsonify(model.predict_image(img))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')