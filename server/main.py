from flask import Flask, jsonify, request
from GPT import generateCodeChallenge, evaluateProblem
import json
import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")

connection = psycopg2.connect(
            host=DATABASE_HOST,
            port=DATABASE_PORT,
            database=DATABASE_NAME,
            user=DATABASE_USER,
            password=DATABASE_PASSWORD
)

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



app.run(host="0.0.0.0", port=8080)



