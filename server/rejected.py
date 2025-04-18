from db_connection import connectDatabase
from flask import Blueprint, jsonify, request
import logging

logger = logging.getLogger(__name__)

rejected = Blueprint('rejected', __name__)

@rejected.get('/getRejected')
def getRejected():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT REJECTED_PROBLEMS
                        FROM REJECTED
                        WHERE USER_ID = %s
                        ''', (user_id,))
        rejected_problems = cursor.fetchall()

        problem_ids = [row[0] for row in rejected_problems]


        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE ID = ANY(%s)
            ''', (problem_ids,))

        questions = cursor.fetchall()

        return jsonify(questions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

def addRejected(data):
    data = request.get_json()
    user_id = data.get("user_id")
    question_id = data.get("question_id")

    if not all ([user_id and question_id]):
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
        return jsonify({"message":"Successfully added problem"})
    except Exception as e:
        return jsonify({"error": str(e)})



@rejected.put('/updateRejected')
def updateRejected():
    data = request.get_json()
    user_id = data.get("user_id")
    rejected_id = data.get("rejected_id")
    name = data.get('name').lower()

    if not all ([user_id, rejected_id, name]):
        return jsonify({"error":"Missing field information"}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT REJECTED_PROBLEMS
                        FROM REJECTED
                        WHERE ID = %s and USER_ID = %s
                        ''', (rejected_id, user_id))
        result = cursor.fetchone()
        question_id = result[0]

        cursor.execute('''
                        UPDATE QUESTIONS
                        SET NAME = %s
                        WHERE ID = %s and USER_ID = %s
                        ''', (name, question_id, user_id))
        connection.commit()
        return jsonify({"message": "Successfully updated name."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@rejected.delete('/deleteRejected')
def deleteRejected():
    data = request.get_json()
    user_id = data.get("user_id")
    rejected_id = data.get("rejected_id")

    if not all ([user_id, rejected_id]):
        return jsonify({"error": "Missing field information."})

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE FROM REJECTED
                        WHERE ID = %s and USER_ID = %s
                        ''', (rejected_id, user_id))
        connection.commit()
        return jsonify({"message": "Successfully deleted problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@rejected.get('/searchRejected')
def searchRejected():
    data = request.get_json()
    user_id = data.get("user_id")
    search_term = data.get("search_term").lower()

    try:

        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT REJECTED_PROBLEMS
                        FROM REJECTED
                        WHERE USER_ID = %s
                        ''', (user_id,))
        rejected_problems = cursor.fetchall()

        problem_ids = [row[0] for row in rejected_problems]


        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE ID = ANY(%s)
            ''', (problem_ids,))

        questions = cursor.fetchall()

        for question in questions:
            if search_term == question[2]:
                return jsonify({"id": question[0], "name": question[2]}), 200
        return jsonify({"error": "No search found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
