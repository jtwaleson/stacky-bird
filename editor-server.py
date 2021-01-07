from flask import Flask, request
from flask_cors import CORS
import os
import json


app = Flask(__name__)
CORS(app)


@app.route('/translate', methods=["POST"])
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


@app.route('/leveledit', methods=["POST"])
def leveledit():
    data = request.json
    code = data["code"]
    title = data["title"]
    description = data["description"]
#    unlocks_levels = data["unlocksLevels"]
#    unlocks_instructions = data["unlocksInstructions"]
    rows = data["rows"]
    cols = data["cols"]
    objects = data["objects"]

    filename = os.path.join("src", "levels", "template")
    with open(filename, "r") as fh:
        template = fh.read()

    template = template.replace("TITLE", title)
    template = template.replace("DESCRIPTION", description)
    template = template.replace("UNLOCKS_LEVELS", "")
    template = template.replace("UNLOCKS_INSTRUCTIONS", "")
    template = template.replace("ROWS", str(rows))
    template = template.replace("COLS", str(cols))
    template = template.replace("OBJECTS", "\n".join([f'        {{ x: {o["x"]}, y: {o["y"]}, ...instructions["{o["code"]}"] }},' for o in objects]))
    with open(os.path.join("src", "levels", f"{code}.js"), "w") as fh:
        fh.write(template)
    return "OK"
