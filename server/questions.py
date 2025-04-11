from db_connection import connectDatabase
from flask import Blueprint, jsonify, request

questions = Blueprint('questions', __name__)

@questions.get("/getProblem")
def getProblem():
    connection = connectDatabase()
    cursor = connection.cursor()

    cursor.execute('''
                   SELECT *
                   FROM
                   QUESTIONS
                   ''')
    response = cursor.fetchall()
    try:
        if response:
            return jsonify(response)
        else:
            return jsonify({"message":"No information found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@questions.post("/addProblem")
def addProblem():
    data = request.get_json()

    user_id = data.get("user_id")
    name = data.get("name").lower()
    problem = data.get("problem").lower()
    is_correct = data.get("is_correct")

    if None in([user_id, name, problem, is_correct]):
        return jsonify({"error": "Missing field information"})
    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        INSERT INTO QUESTIONS (USER_ID, NAME, PROBLEM, IS_CORRECT)
                        VALUES (%s, %s, %s, %s)
                    ''', (user_id, name, problem, is_correct))
        connection.commit()
        return jsonify({"message": "Problem added successfully"}), 201
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    finally:
        if cursor and connection:
            cursor.close()
            connection.close()

@questions.put("/updateProblem")
def updateProblem():
    data = request.get_json()

    id = data.get("questions_id")
    user_id = data.get("user_id")
    name = data.get("name").lower()
    is_correct = data.get("is_correct")

    if not all([id, user_id, name, is_correct]):
        return jsonify({"error": "Missing field information"}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        UPDATE QUESTIONS
                        SET NAME = %s, IS_CORRECT = %s
                        WHERE ID = %s AND USER_ID = %s
                    ''', (name, is_correct, id, user_id))
        connection.commit()
        return jsonify({"message": "Problem updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

@questions.delete('/deleteProblem')
def deleteProblem():
    data = request.get_json()
    user_id = data.get("user_id")
    id = data.get("questions_id")

    if not all([user_id, id]):
        return jsonify({"message": "Please input missing field."}), 400

    try:
        connection = connectDatabase()
        cursor = connection.cursor()

        cursor.execute('''
                        DELETE FROM QUESTIONS
                        WHERE ID = %s AND USER_ID = %s
                    ''', (id, user_id))
        connection.commit()
        return jsonify({"message": "Successfully deleted problem"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()