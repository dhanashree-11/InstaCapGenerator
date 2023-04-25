from __future__ import division, print_function
import sys
import os
import glob
import re
import numpy as np
import csv
import tensorflow as tf
from flask_cors import CORS, cross_origin
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image
from keras.utils import image_utils
from flask import Flask, redirect, url_for, request, render_template
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

app = Flask(__name__)  # defines entry point
CORS(app)
my_path = 'model.h5'
model = load_model(my_path)


def model_predict(img_path, model):
    img =  image_utils.load_img(img_path, target_size=(224, 224))
    input_arr = tf.keras.preprocessing.image.img_to_array(img)
    input_arr = np.array([input_arr])  
    input_arr = input_arr.astype('float32') / 255
    predictions = model.predict(input_arr)
    pre_class=predictions.argmax() # args=output
    return pre_class


@app.route("/", methods=['GET', 'POST'])
def runnn():
    if request.method == 'POST':
        f = request.files['myFile']
        print(f)

        basepath = os.path.dirname(__file__)
        file_path = os.path.join(
            basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        preds = model_predict(file_path, model)

        result = preds

        if result == 0:
            result = "boys"
        elif result == 1:
            result = "girl"
        elif result == 2:
            result = "group"
        else:
            result = "pets"
        file = open("Dataset/ClassData/Captions/"+result+".csv", "r") 
        reader = csv.reader(file)
        i = 0
        captions = []
        for line in reader:
            if i!=0:
                obj = {
                    "caption": line[1],
                    "rating": line[2]
                }
                captions.append(obj)
            i+=1
            if i>=50:
                break

        response = {
            "class": result,
            "captions": captions,
            "total": i,
            "file": f
        }
        return render_template('index.html', response=response)
    else:
        return render_template('index.html')


@app.route("/dhanashree")
def runn1():
    return "hello there!"


if __name__ == "__main__":
    app.run(debug=True)
