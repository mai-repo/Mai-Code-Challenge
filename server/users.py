from db_connection import connectDatabase
from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
import logging
import json
import base64, os
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
users = Blueprint('users', __name__)

load_dotenv()
FIREBASE_KEY = os.getenv("FIREBASE_KEY")

serviceAccountKey = json.loads(
    base64.b64decode(FIREBASE_KEY).decode("utf-8")
)

if not firebase_admin._apps:
    cred = credentials.Certificate(serviceAccountKey)
    firebase_admin.initialize_app(cred)


@users.put('/updateUsername')
def updateUsername():
    data = request.get_json()
    user_id = data.get("user_id")
    username = data.get("username")

    if not all([user_id, username]):
        return jsonify({"error":"Missing field information"}), 400

    username = username.lower()

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

        cursor.close()
        connection.close()

        return jsonify({"message": "User updated successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users.put('/updatePassword')
def updatePassword():
    data = request.get_json()
    email = data.get("email")

    if (not email):
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

        cursor.close()
        connection.close()
        auth.delete_user(uid)
        return jsonify({"message": "User deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users.post('/createUser')
def createUser():
    data = request.get_json()
    email = data.get("email")
    name = data.get("name")
    password = data.get("password")

    if not all([email, name, password]):
        return jsonify({"error": "Missing field information."}), 400

    name = name.lower()

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
        cursor.close()
        connection.close()

        return jsonify({"message": "User created."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@users.post("/authentication/login")
def login():

    id_token = request.headers.get("Authorization").split(" ")[1]

    if not id_token:
        return jsonify({"error": "Missing ID token"}), 401

    try:
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT * FROM USERS
                        WHERE UID = %s
                        ''', (uid,))

        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            return jsonify({
                "id": user[0],
                "name": user[1],
                "uid": uid
            }), 200
        else:
            return jsonify({"error": "User not found in database."}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
