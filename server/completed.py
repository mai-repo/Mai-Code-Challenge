from db_connection import connectDatabase
from flask import Blueprint, jsonify, request

completed = Blueprint("completed", __name__)

@completed.get("/getCompleted")
def getCompleted():
    data = request.get_json()
    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT COMPLETED_PROBLEMS
                        FROM COMPLETED
                        WHERE USER_ID = %s
                        ''', (user_id,))

        results = cursor.fetchall()

        problem_ids = [row[0] for row in results]

        if not problem_ids:
            return jsonify([])

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
        if connection:
            cursor.close()
            connection.close()

