from flask import Flask, request
from flask_cors import CORS
import os
import json


app = Flask(__name__)
CORS(app)


@app.route('/', methods=["POST"])
def translate():
    data = request.json
    language = data["language"]
    key = data["key"]
    value = data["value"]
    filename = os.path.join("src", "translations", f"{language}.json")
    with open(filename, "r") as fh:
        current = json.load(fh)

    current[key] = value
    with open(filename, "w") as fh:
        json.dump(current, fh, indent=4, sort_keys=True)
        fh.write("\n")
    return "OK"
