from flask import Flask, request,jsonify
from flask_cors import CORS
from test import *

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/',methods = ['GET','POST'])
def home() :
    if request.method == 'POST' :
        data = request.json
        print(data)
        response_data = predict_results(data)
        return jsonify(response_data), 201 
    
    return jsonify('bad request') ,400


if __name__ == '__main__' :
    app.run(debug=True)