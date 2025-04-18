from flask import Flask, jsonify, request
import requests
from GPT import generateCodeChallenge, evaluateProblem
from questions import questions
from users import users
from rejected import rejected
from completed import completed
from favorite import favorite
from user_question_status import status
import requests
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv
from flask_cors import CORS
import os
import logging
from bs4 import BeautifulSoup
import random

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.register_blueprint(questions)
app.register_blueprint(users)
app.register_blueprint(rejected)
app.register_blueprint(completed)
app.register_blueprint(favorite)
app.register_blueprint(status)

CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "http://192.168.1.203:3000",
            "https://backendcodechallenge.vercel.app",
            "https://mai-code-challenges.vercel.app/"
        ],
        "supports_credentials": True
    }
})

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour"],
)

load_dotenv()
BACKEND_KEY = os.getenv("BACKEND_KEY")

@app.route("/")
def index():
    return jsonify({"message": "Welcome to the Code Challenge API!"}), 200

@app.get("/generateChallenge")
@limiter.limit("10 per minute")
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
@limiter.limit("10 per minute")
def evaluateAnswer():
    try:
        data = request.get_json()
        challenge = data.get("challenge")
        answer = data.get("answer")

        if not challenge or not answer:
            return jsonify({"message": "Missing either challenge or answer"}), 400

        evaluation = evaluateProblem(challenge, answer)
        return jsonify(evaluation), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.post('/verifyUser')
def verify_user():
    try:
        data = request.get_json()
        token = data.get('token')
        secret = BACKEND_KEY

        recaptcha_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            data={
                'secret': secret,
                'response': token
            }
        )
        result = recaptcha_response.json()

        if result.get('success'):
            return jsonify({"message":'reCAPTCHA verified successfully!'}), 200
        else:
            return jsonify({"message":'Failed to verify reCAPTCHA.'}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.get('/scrape')
def scrape():
    random_problem = random.randint(0, 19)

    url = f"https://projecteuler.net/problem={random_problem}"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        problem = soup.find('div', class_='problem_content', role="problem")

        if problem:
            paragraphs = problem.find_all('p')
            paragraphs_text = [para.get_text(strip=True) for para in paragraphs]

            return jsonify({'problem_content': paragraphs_text})
        else:
            return jsonify({"error": "Problem content not found."}), 404
    else:
        return jsonify({"error": f"Failed to retrieve the webpage. Status code: {response.status_code}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5432)


