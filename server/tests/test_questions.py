import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from questions import questions
class TestQuestions(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(questions)
        self.client = self.app.test_client()

    @patch('questions.pagination')
    @patch('questions.connectDatabase')
    def test_getProblem_200(self, mock_connectDatabase, mock_pagination):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        db_response = [[100, 11, "Convert to Str", "Write a funtion that converts an array into strings", "Tues, 29 Apr", False]]
        mock_cursor.fetchall.return_value = db_response

        pagination = {
            "current_page": 1,
            "per_page": 5,
            "total_items": 1,
            "total_pages": 1
        }
        mock_pagination.return_value = {"data": db_response, "pagination": pagination }

        response = self.client.get('/getProblem?user_id=11')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["data"], db_response)
        self.assertEqual(response.get_json()["pagination"], pagination)

    @patch('questions.connectDatabase')
    def test_getProblem_404(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = []

        response = self.client.get('/getProblem?user_id=11')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"message": "No information found"})

    @patch('questions.connectDatabase')
    def test_getProblem_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.get('/getProblem?user_id=11')
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('questions.addRejected')
    @patch('questions.addStatus')
    @patch('questions.connectDatabase')
    def test_addProblem_200(self, mock_connectDatabase, mock_addStatus, mock_addRejected):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = [12]

        response = self.client.post('/addProblem', json={"user_id":12, "name": "Test", "problem": "Testing", "is_correct": False})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Problem added successfully", "question_id": 12, "is_correct": False})

    def test_addProblem_400(self):
        response = self.client.post('/addProblem', json={"user_id":12, "name": "Test", "problem": "Testing"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information"})

    @patch('questions.connectDatabase')
    def test_addProblem_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")

        response = self.client.post('/addProblem', json={"user_id":12, "name": "Test", "problem": "Testing", "is_correct": False})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('questions.addRejected')
    @patch('questions.addCompleted')
    @patch('questions.updateStatus')
    @patch('questions.connectDatabase')
    def test_updateProblem_200(self, mock_connectDatabase, mock_updateStatus, mock_addCompleted, mock_addRejected):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.put('/updateProblem', json={"id": 12, "user_id": 12, "name": "Test", "is_correct": True})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Problem updated successfully"})

    @patch('questions.connectDatabase')
    def test_updateProblem_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.put('/updateProblem', json={"id": 12, "user_id": 12, "name": "Test", "is_correct": True})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('questions.connectDatabase')
    def test_deleteProblem(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.delete('/deleteProblem', json={"user_id": 12, "questions_id": 40})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully deleted problem"})

    def test_deleteProblem(self):
        response = self.client.delete('/deleteProblem', json={"user_id": 12})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"message": "Please input missing field."})

    @patch('questions.connectDatabase')
    def test_delete(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.delete('/deleteProblem', json={"user_id": 12, "questions_id": 40})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('questions.connectDatabase')
    def test_searchQuestion(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchall.return_value = [[1, 12, "arr", "create a function that takes in an array of integers and returns a new array containing only the even numbers.", "2025-04-21", False]]

        response = self.client.get('/searchQuestions?user_id=12&searchTerm=arr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), [[1, 12, "arr", "create a function that takes in an array of integers and returns a new array containing only the even numbers."]])

    @patch('questions.connectDatabase')
    def test_searchQuestion(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.get("/searchQuestions?user_id=12&searchTerm=arr")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

if __name__ == "__main__":
    unittest.main()