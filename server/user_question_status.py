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


def addStatus(user_id, question_id, status):

    if status not in ['COMPLETED', 'REJECTED']:
        return jsonify({'error': 'Invalid status value'}), 400

    if not all([user_id, question_id, status]):
        return jsonify({"error": "Missing field informaiton."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        INSERT INTO USER_QUESTION_STATUS (USER_ID, QUESTION_ID, STATUS)
                        VALUES(%s, %s, %s)
                       ''', (user_id, question_id, status))
        connection.commit()
        return jsonify({"message": "Status added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

def updateStatus(user_id, id, status):

    if status not in ['COMPLETED', 'REJECTED']:
        return jsonify({'error': 'Invalid status value'}), 400

    if not all([user_id, id, status]):
        return jsonify({"error": "Missing field informaiton."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE USER_QUESTION_STATUS
                        SET STATUS = %s
                        WHERE USER_ID = %s AND QUESTION_ID = %s
                       ''', (status, user_id, id))
        connection.commit()
        return jsonify({"message": "Status added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
