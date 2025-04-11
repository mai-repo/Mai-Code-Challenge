from db_connection import connectDatabase
from flask import jsonify, Blueprint, request

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
        return jsonify({"message": "Favorite added successfully."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
            cursor.close()
            connection.close()



