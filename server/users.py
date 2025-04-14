from db_connection import connectDatabase
from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
import logging

logger = logging.getLogger(__name__)
users = Blueprint('users', __name__)

if not firebase_admin._apps:
    cred = credentials.Certificate('firebase.json')
    firebase_admin.initialize_app(cred)


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
                        SELECT * FROM USERS
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
def updatePassword():
    data = request.get_json()
    uid = data.get("uid")
    email = data.get("email")

    if not all([uid, email]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        link = auth.generate_password_reset_link(email)
        return jsonify({"reset_link": link}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@users.delete('/deleteUser')
def deleteUser():
    data = request.get_json()
    user_id = data.get("user_id")
    uid = data.get("uid")

    if not user_id:
        return jsonify({"error": "Missing user id"}), 400

    try:
        auth.delete_user(uid)
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE
                        FROM USERS
                        WHERE ID = %s and UID = %s
                       ''', (user_id, uid))
        connection.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No user found to delete."}), 404

        return jsonify({"message": "User deleted successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@users.post('/createUser')
def createUser():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name").lower()
    password = data.get("password")

    if not all([email, name, password]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        user = auth.create_user(email=email, password=password)
        uid = user.uid
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute( '''
                        INSERT INTO USERS (uid, email, name)
                        VALUES (%s, %s, %s)
                        ''', (uid, email, name)
        )
        connection.commit()
        return jsonify({"message": "User created."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()
