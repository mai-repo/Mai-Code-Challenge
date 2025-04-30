import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from rejected import rejected, addRejected

class TestQuestions(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(rejected)
        self.client = self.app.test_client()

    @patch("rejected.pagination")
    @patch("rejected.connectDatabase")
    def test_getRejected_200(self, mock_connectDatabase, mock_pagination):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value  = mock_cursor

        problem_ids = [[60]]
        mock_cursor.fetchall.return_value = problem_ids

        questions =[[60, 11, "Convert to Str", "Write a funtion that converts an array into strings", "Tues, 29 Apr", False]]
        mock_cursor.fetchall.return_value = questions

        pagination = {
            "current_page": 1,
            "per_page": 5,
            "total_items": 15,
            "total_pages": 3
        }
        mock_pagination.return_value = {"data": questions, "pagination": pagination }

        response = self.client.get('/getRejected?user_id=12')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"data": questions, "pagination": pagination})

    def test_getRejected_400(self):
        response = self.client.get('/getRejected')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("rejected.connectDatabase")
    def test_getRejected_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.get("/getRejected?user_id=12")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("rejected.connectDatabase")
    def test_addRejected_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        with self.app.app_context():
            response, status_code = addRejected(12, 60)

        self.assertEqual(status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully added problem"})

    def test_addRejected_400(self):
        with self.app.app_context():
            response, status_code = addRejected(12, None)
        self.assertEqual(status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("rejected.connectDatabase")
    def test_addRejected_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")

        with self.app.app_context():
            response, status_code = addRejected(12, 60)

        self.assertEqual(status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("rejected.connectDatabase")
    def test_updateRejected_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.put("/updateRejected", json={"user_id":12, "rejected_id": 60, "name": "arr"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully updated name."})

    def test_updatedRejected_400(self):
        response = self.client.put("/updateRejected", json={"user_id": 12, "rejected_id":60})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information"})

    @patch("rejected.connectDatabase")
    def test_updatedRejected_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        response = self.client.put("/updateRejected", json={"user_id":12, "rejected_id":60, "name": "arr"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("rejected.connectDatabase")
    def test_deleteRejected_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.delete("/deleteRejected", json={"user_id": 12, "rejected_id": 60})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Successfully deleted problem"})

    def test_deleteRejected_400(self):
        response = self.client.delete("/deleteRejected", json={"user_id":12})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("rejected.connectDatabase")
    def test_deleteRejected_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        response = self.client.delete("/deleteRejected", json={"user_id": 12, "rejected_id":60})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

if __name__ == "__main__":
    unittest.main()