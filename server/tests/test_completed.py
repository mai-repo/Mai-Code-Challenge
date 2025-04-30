import unittest
from unittest.mock import patch, MagicMock
from flask import Flask
from completed import completed

class TestQuestions(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(completed)
        self.client = self.app.test_client()

    # @patch('completed.pagination')
    # @patch(completed.connectDatabase)
    # def getCompleted(self, mock_connectDatabase):
    #     mock_connection = MagicMock()
    #     mock_cursor = MagicMock()

    #     mock_connectDatabase = mock_connection
    #     mock_connection.cursor.return_value  = mock_cursor

    #     db_response =

    #     mock_cursor.fetchall.return_value = db_response

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

if __name__ == "__main__":
    unittest.main()
