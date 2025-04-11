from flask import Flask, jsonify, request
from GPT import generateCodeChallenge, evaluateProblem
from questions import questions
from users import users
from rejected import rejected

app = Flask(__name__)
app.register_blueprint(questions)
app.register_blueprint(users)
app.register_blueprint(rejected)

@app.get("/generateChallenge")
def getChallenge():
    try:
        codeChallenge = generateCodeChallenge()
        if codeChallenge:
            return jsonify(codeChallenge), 200
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
            return jsonify({"error": "Missing either challenge or answer"}), 400

        evaluation = evaluateProblem(challenge, answer)
        return jsonify(evaluation), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5432)



