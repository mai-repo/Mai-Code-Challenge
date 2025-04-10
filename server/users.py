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

