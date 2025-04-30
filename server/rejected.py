from db_connection import connectDatabase
from flask import Blueprint, jsonify, request
from pagination import pagination
import logging

logger = logging.getLogger(__name__)
rejected = Blueprint('rejected', __name__)

@rejected.get('/getRejected')
def getRejected():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT REJECTED_PROBLEMS
                        FROM REJECTED
                        WHERE USER_ID = %s
                        ''', (user_id, ))
        rejected_problems = cursor.fetchall()

        problem_ids = [row[0] for row in rejected_problems]

        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE ID = ANY(%s)
            ''', (problem_ids,))

        questions = cursor.fetchall()
        cursor.close()
        connection.close()

        return pagination(questions), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def addRejected(user_id, question_id):

    if not all ([user_id , question_id]):
        return jsonify({"error": "Missing field information."}), 400
    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        INSERT INTO REJECTED (USER_ID, REJECTED_PROBLEMS)
                        VALUES (%s, %s)
                        ''', (user_id, question_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message":"Successfully added problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@rejected.put('/updateRejected')
def updateRejected():
    data = request.get_json()
    user_id = data.get("user_id")
    rejected_id = data.get("rejected_id")
    name = data.get('name')

    if not all ([user_id, rejected_id, name]):
        return jsonify({"error":"Missing field information"}), 400
    name = name.lower()
    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE QUESTIONS
                        SET NAME = %s
                        WHERE id = %s and USER_ID = %s
                        ''', (name, rejected_id, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Successfully updated name."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@rejected.delete('/deleteRejected')
def deleteRejected():
    data = request.get_json()
    user_id = data.get("user_id")
    rejected_id = data.get("rejected_id")

    if not all ([user_id, rejected_id]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE FROM REJECTED
                        WHERE REJECTED_PROBLEMS = %s and USER_ID = %s
                        ''', (rejected_id, user_id))
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"message": "Successfully deleted problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
