from db_connection import connectDatabase
from flask import Blueprint, request, jsonify

users = Blueprint('users', __name__)

@users.get('/getUser')
def getUser():
    data = request.get_json()
    user_id = data.get("user_id")

    if (not user_id):
        return jsonify({"error": "No user id present."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT NAME, EMAIL
                        FROM
                        USERS
                        WHERE ID = %s
                    ''', (user_id))

        response = cursor.fetchone()

        if response:
            return jsonify({"name": response[0], "email": response[1]})
        else:
            return jsonify({"error": "No user found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@users.put('/updateUsername')
def updateUsername():
    data = request.get_json()
    user_id = data.get("user_id")
    username = data.get("username").lower()

    if not all([user_id, username]):
        return jsonify({"error":"Missing field information"}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE USERS
                        SET NAME = %s
                        WHERE ID = %s
                        ''', (username, user_id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No user found to update."}), 404

        return jsonify({"message": "User updated successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@users.put('/updatePassword')
def updatePassword ():
    data = request.get_json()
    password = data.get("password").lower()
    user_id = data.get("user_id")

    if not password:
        return jsonify({"error": "Please input a password."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE USERS
                        SET PASSWORD = %s
                        WHERE ID = %s
                        ''', (password, user_id))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No user found to update."}), 404
        return jsonify({"message": "User password updated successfully."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

