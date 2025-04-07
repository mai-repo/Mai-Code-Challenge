from flask import flask, jsonify, request
from GPT import generateCodeChallenge, evaluateProblem

app = Flask(__name__)

@app.get("/generateChallenge", methods=["GET"])
def getChallenge():
    try:
        codeChallenge = generateCodeChallenge()
        if codeChallenge:
            response = jsonify(codeChallenge), 200
            return response
        else:
            return jsonify({"error": "Failed to generate challenge"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.post("/evaluateAnswer", methods=["POST"])
def evaluateAnswer():
    try:
        data = request.get_json()
        challenge = data.get("challenge")
        answer = data.get("answer")

        if not challenge or not answer:
            return jsonify({"error": "Missing either challenge or answer"})

        evaluation = evaluateProblem(challenge, answer)
        return jsonify(evaluation), 200
    except Exception as e:
        return jsonify ({"error": str(e) }), 500




