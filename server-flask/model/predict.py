# The steps implemented in the object detection sample code: 
# 1. for an image of width and height being (w, h) pixels, resize image to (w', h'), where w/h = w'/h' and w' x h' = 262144
# 2. resize network input size to (w', h')
# 3. pass the image to network and do inference
# (4. if inference speed is too slow for you, try to make w' x h' smaller, which is defined with DEFAULT_INPUT_SIZE (in object_detection.py or ObjectDetection.cs))
"""Sample prediction script for TensorFlow 2.x."""
import sys
import tensorflow as tf
import numpy as np
from PIL import Image
from object_detection import ObjectDetection
import cv2

MODEL_FILENAME = 'model.pb'
LABELS_FILENAME = 'labels.txt'


class TFObjectDetection(ObjectDetection):
    """Object Detection class for TensorFlow"""

    def __init__(self, graph_def, labels):
        super(TFObjectDetection, self).__init__(labels)
        self.graph = tf.compat.v1.Graph()
        with self.graph.as_default():
            input_data = tf.compat.v1.placeholder(tf.float32, [1, None, None, 3], name='Placeholder')
            tf.import_graph_def(graph_def, input_map={"Placeholder:0": input_data}, name="")

    def predict(self, preprocessed_image):
        inputs = np.array(preprocessed_image, dtype=np.float)[:, :, (2, 1, 0)]  # RGB -> BGR

        with tf.compat.v1.Session(graph=self.graph) as sess:
            output_tensor = sess.graph.get_tensor_by_name('model_outputs:0')
            outputs = sess.run(output_tensor, {'Placeholder:0': inputs[np.newaxis, ...]})
            return outputs[0]


def main(image_filename):
    # Load a TensorFlow model
    graph_def = tf.compat.v1.GraphDef()
    with tf.io.gfile.GFile(MODEL_FILENAME, 'rb') as f:
        graph_def.ParseFromString(f.read())

    # Load labels
    with open(LABELS_FILENAME, 'r') as f:
        labels = [l.strip() for l in f.readlines()]

    od_model = TFObjectDetection(graph_def, labels)

    image = Image.open(image_filename)
    predictions = od_model.predict_image(image)
    
    image_cv = cv2.imread(image_filename)
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

    cv2.imwrite("Predicted-img.jpg", image_cv)
    window_name = 'image'
    cv2.imshow(window_name, image_cv)
    cv2.waitKey()


def get_model():
    # Load a TensorFlow model
    graph_def = tf.compat.v1.GraphDef()
    with tf.io.gfile.GFile(MODEL_FILENAME, 'rb') as f:
        graph_def.ParseFromString(f.read())

    # Load labels
    with open(LABELS_FILENAME, 'r') as f:
        labels = [l.strip() for l in f.readlines()]

    od_model = TFObjectDetection(graph_def, labels)
    return od_model


if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('USAGE: {} image_filename'.format(sys.argv[0]))
    else:
        main(sys.argv[1])
