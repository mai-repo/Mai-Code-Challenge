import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from completed import completed, addCompleted
class TestCompleted(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(completed)
        self.client = self.app.test_client()

    @patch('completed.pagination')
    @patch('completed.connectDatabase')
    def test_getCompleted_200(self, mock_connectDatabase, mock_pagination):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value  = mock_cursor

        problems_id = [[60]]
        mock_cursor.fetchall.return_value = problems_id

        questions =[[60, 11, "Convert to Str", "Write a funtion that converts an array into strings", "Tues, 29 Apr", False]]
        mock_cursor.fetchall.return_value = questions

        pagination = {
            "current_page": 1,
            "per_page": 5,
            "total_items": 15,
            "total_pages": 3
        }
        mock_pagination.return_value = {"data": questions, "pagination": pagination }

        response = self.client.get('/getCompleted?user_id=12')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"data": questions, "pagination": pagination })

    def test_getCompleted_400(self):
        response = self.client.get('/getCompleted')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch('completed.connectDatabase')
    def test_getCompleted_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        response = self.client.get('/getCompleted?user_id=12')
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('completed.connectDatabase')
    def test_addCompleted_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value  = mock_cursor

        with self.app.app_context():
            response, status_code = addCompleted(12, 60)
        self.assertEqual(status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Completed Problem added successfully"})

    def test_addCompleted_400(self):
        with self.app.app_context():
            response, status_code = addCompleted(12, None)
        self.assertEqual(status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch('completed.connectDatabase')
    def test_addCompleted_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        with self.app.app_context():
            response, status_code = addCompleted(12, 60)

        self.assertEqual(status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('completed.connectDatabase')
    def test_updateCompleted_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.put("/updateCompleted", json={"user_id": 12, "name": "Test", "completed_id": 60})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully updating name."})

    def test_updateCompleted_400(self):
        response = self.client.put("/updateCompleted", json={"user_id": 12, "name": "Test"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch('completed.connectDatabase')
    def test_updateCompleted_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")

        response = self.client.put("/updateCompleted", json={"user_id": 12, "name": "Test", "completed_id": 60})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('completed.connectDatabase')
    def test_deleteCompleted_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.delete("/deleteCompleted", json={"user_id": 12, "completed_id": 60})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully deleted problem"})

    def test_deleteCompleted_400(self):
        response = self.client.delete("/deleteCompleted", json={"user_id": 12})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch('completed.connectDatabase')
    def test_deleteCompleted_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        response = self.client.delete("/deleteCompleted", json={"user_id": 12, "completed_id": 60})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

if __name__ == "__main__":
    unittest.main()
