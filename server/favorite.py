from db_connection import connectDatabase
from flask import jsonify, Blueprint, request
from pagination import paignation
import logging

logger = logging.getLogger(__name__)

favorite = Blueprint("favorite", __name__)

@favorite.post("/addFavorite")
def addFavorite():
    data = request.get_json()
    user_id = data.get('user_id')
    favorite_problems = data.get('favorite_problems')

    if not all ([user_id, favorite_problems]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        INSERT INTO FAVORITES (USER_ID, FAVORITE_PROBLEMS)
                        VALUES(%s, %s)
                       ''', (user_id, favorite_problems))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Favorite added successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@favorite.get('/getFavorite')
def getFavorite():
    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing field information"}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT * FROM FAVORITES
                        WHERE USER_ID = %s
                       ''', (user_id,))
        favorite_problems = cursor.fetchall()
        problem_ids = [row[2] for row in favorite_problems]

        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE ID = ANY(%s)
            ''', (problem_ids,))

        response = cursor.fetchall()
        cursor.close()
        connection.close()
        return paignation(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@favorite.put('/updateFavorite')
def updateFavorite():
    data = request.get_json()
    user_id = data.get('user_id')
    favorite_id = data.get('favorite_id')
    name = data.get('name')

    if not all([user_id, favorite_id, name]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE QUESTIONS
                        SET NAME = %s
                        WHERE ID = %s and USER_ID = %s
                        ''', (name, favorite_id, user_id))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Favorite updated successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@favorite.delete('/deleteFavorite')
def deleteFavorite():
    data = request.get_json()
    user_id = data.get('user_id')
    favorite_id = data.get('favorite_id')

    if not all ([user_id, favorite_id]):
        return jsonify({"error": "Missing field information."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE FROM FAVORITES
                        WHERE FAVORITE_PROBLEMS = %s AND USER_ID = %s
                        ''', (favorite_id, user_id))

        connection.commit()
        cursor.close()
        connection.close()
        return jsonify({"message": "Favorite deleted successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@favorite.get('/searchFavorite')
def searchFavorite():
    data = request.get_json()
    user_id = data.get("user_id")
    search_term = data.get("search_term").lower()

    try:

        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        SELECT FAVORITE_PROBLEMS
                        FROM FAVORITES
                        WHERE USER_ID = %s
                        ''', (user_id,))
        favorite_problems = cursor.fetchall()

        problem_ids = [row[0] for row in favorite_problems]

        cursor.execute('''
            SELECT *
            FROM QUESTIONS
            WHERE ID = ANY(%s)
            ''', (problem_ids,))

        questions = cursor.fetchall()

        for question in questions:
            if search_term == question[2]:
                return jsonify({"id": question[0], "name": question[2]}), 200

        cursor.close()
        connection.close()
        return jsonify({"error": "No search found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500