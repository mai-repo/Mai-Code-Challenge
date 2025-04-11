from db_connection import connectDatabase
from flask import Blueprint, jsonify, request

status = Blueprint('status', __name__)

@status.get("/getStatus")
def getStatus():
    data = request.get_json()
    user_id = data.get("user_id")
    status_id = data.get("status_id")

    if not all (user_id and status_id):
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT * FROM USER_QUESTIONS_STATUS
                        WHERE user_id = %s and id = %s
                        ''', (user_id, status_id))
        response = cursor.fetchall()
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
            cursor.close()
            connection.close()

