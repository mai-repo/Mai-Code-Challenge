from flask import Flask, jsonify, request
from GPT import generateCodeChallenge, evaluateProblem
import json

app = Flask(__name__)

@app.get("/generateChallenge")
def getChallenge():
    try:
        codeChallenge = generateCodeChallenge()
        if codeChallenge:
            response = json.loads(codeChallenge), 200
            return response
        else:
            return jsonify({"error": "Failed to generate challenge"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.post("/evaluateAnswer")
def evaluateAnswer():
    try:
        data = request.get_json()
        challenge = data.get("challenge")
        answer = data.get("answer")

        if not challenge or not answer:
            return jsonify({"error": "Missing either challenge or answer"})

        evaluation = evaluateProblem(challenge, answer)
        return json.loads(evaluation), 200
    except Exception as e:
        return jsonify ({"error": str(e) }), 500

app.run(host="0.0.0.0", port=80)



