from db_connection import connectDatabase
from flask import Blueprint, jsonify, request

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

        problem_ids = [[row[0]] for row in rejected_problems]


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

