import unittest
from unittest.mock import patch, MagicMock
from user_question_status import status, addStatus, updateStatus
from flask import Flask

class TestUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(status)
        self.client = self.app.test_client()

    @patch("user_question_status.connectDatabase")
    def test_getStatus_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        db_response = [[53, 12, 54, "REJECTED"]]
        mock_cursor.fetchall.return_value = db_response

        response = self.client.get("/getStatus?user_id=12")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully grabbed the information", "response": db_response})

    def test_getStatus_400(self):
        response = self.client.get("/getStatus")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("user_question_status.connectDatabase")
    def test_getStatus_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")

        response = self.client.get("/getStatus?user_id=12")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("user_question_status.connectDatabase")
    def test_addStatus_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        with self.app.app_context():
            response, status_code = addStatus(12, 60, "COMPLETED")
        self.assertEqual(status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Status added successfully"})

    def test_addStatus_400(self):
        with self.app.app_context():
            response, status_code = addStatus(12, 60, None)

        self.assertEqual(status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Invalid status value"})

    @patch("user_question_status.connectDatabase")
    def test_addStatus_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")

        with self.app.app_context():
            response, status_code = addStatus(12,60, "COMPLETED")

        self.assertEqual(status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("user_question_status.connectDatabase")
    def test_updateStatus_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        with self.app.app_context():
            response, status_code = updateStatus(12, 60, "REJECTED")

        self.assertEqual(status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Status added successfully"})

    def test_updateStatus_400(self):

        with self.app.app_context():
            response, status_code = updateStatus(12, 60, None)
        self.assertEqual(status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Invalid status value"})

    @patch("user_question_status.connectDatabase")
    def test_updateStatus_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")

        with self.app.app_context():
            response, status_code = updateStatus(12, 60, "REJECTED")

        self.assertEqual(status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})


if __name__ == "__main__":
    unittest.main()