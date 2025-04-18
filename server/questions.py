from db_connection import connectDatabase
from user_question_status import addStatus, updateStatus
from rejected import addRejected
from completed import addCompleted
from flask import Blueprint, jsonify, request
import logging

logger = logging.getLogger(__name__)

questions = Blueprint('questions', __name__)

@questions.get("/getProblem")
def getProblem():
    connection = connectDatabase()
    cursor = connection.cursor()

    cursor.execute('''
                   SELECT *
                   FROM
                   QUESTIONS
                   ''')
    response = cursor.fetchall()
    try:
        if response:
            return jsonify(response)
        else:
            return jsonify({"message":"No information found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@questions.post("/addProblem")
def addProblem():
    data = request.get_json()

    user_id = data.get("user_id")
    name = data.get("name").lower()
    problem = data.get("problem").lower()
    is_correct = data.get("is_correct")

    if None in([user_id, name, problem, is_correct]):
        return jsonify({"error": "Missing field information"})
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

        data = {
            "user_id": user_id,
            "question_id": question_id
        }

        if is_correct == True:
            addCompleted(data)
        else:
            addRejected(data)



        return jsonify({"message": "Problem added successfully", "question_id": question_id}), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    finally:
            cursor.close()
            connection.close()

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

        return jsonify({"message": "Problem updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

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
        return jsonify({"message": "Successfully deleted problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()