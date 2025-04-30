from db_connection import connectDatabase
from user_question_status import addStatus, updateStatus
from rejected import addRejected
from completed import addCompleted
from pagination import pagination
from flask import Blueprint, jsonify, request
import logging

logger = logging.getLogger(__name__)
questions = Blueprint('questions', __name__)

@questions.get("/getProblem")
def getProblem():
    try:
        user_id = request.args.get('user_id')

        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                    SELECT * FROM QUESTIONS
                    WHERE USER_ID = %s
                    ''', (user_id,))
        response = cursor.fetchall()
        cursor.close()
        connection.close()
        if response:
            return pagination(response), 200
        else:
            return jsonify({"message":"No information found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@questions.post("/addProblem")
def addProblem():
    data = request.get_json()

    user_id = data.get("user_id")
    name = data.get("name").lower()
    problem = data.get("problem").lower()
    is_correct = data.get("is_correct")

    if None in([user_id, name, problem, is_correct]):
        return jsonify({"error": "Missing field information"}), 400
    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        INSERT INTO QUESTIONS (USER_ID, NAME, PROBLEM, IS_CORRECT)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id
                    ''', (user_id, name, problem, is_correct))
        question_id = cursor.fetchone()[0]
        connection.commit()

        status = "COMPLETED" if is_correct == True else "REJECTED"
        addStatus(user_id, question_id, status)

        if is_correct == True:
            addCompleted(user_id, question_id)
        else:
            addRejected(user_id, question_id)

        cursor.close()
        connection.close()
        return jsonify({"message": "Problem added successfully", "question_id": question_id, "is_correct": is_correct}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

@questions.put("/updateProblem")
def updateProblem():
    data = request.get_json()

    id = data.get("id")
    user_id = data.get("user_id")
    name = data.get("name")
    is_correct = data.get("is_correct")

    try:
        connection = connectDatabase()
        cursor = connection.cursor()
        cursor.execute('''
                        UPDATE QUESTIONS
                        SET NAME = %s, IS_CORRECT = %s
                        WHERE ID = %s AND USER_ID = %s
                    ''', (name, is_correct, id, user_id))
        connection.commit()

        status = "COMPLETED" if is_correct == True else "REJECTED"
        updateStatus(user_id, id, status)

        if is_correct == True:
            addCompleted(user_id, id)
        else:
            addRejected(user_id, id)

        cursor.close()
        connection.close()
        return jsonify({"message": "Problem updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@questions.delete('/deleteProblem')
def deleteProblem():
    data = request.get_json()
    user_id = data.get("user_id")
    id = data.get("questions_id")

    if not all([user_id, id]):
        return jsonify({"message": "Please input missing field."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE FROM QUESTIONS
                        WHERE ID = %s AND USER_ID = %s
                    ''', (id, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Successfully deleted problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@questions.get('/searchQuestions')
def searchQuestions():
    user_id = request.args.get("user_id")
    searchTerm = request.args.get("searchTerm")
    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE USER_ID = %s
            ''', (user_id,))
        questions = cursor.fetchall()

        matched_questions = []
        for question in questions:
            question_name = question[2].lower()
            if question_name.startswith(searchTerm[:3]):
                matched_questions.append([question[0], question[1], question[2], question[3]])

        return jsonify(matched_questions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
