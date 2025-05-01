import unittest
from unittest.mock import patch, MagicMock
from favorite import favorite
from flask import Flask

class TestFavorites(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(favorite)
        self.client = self.app.test_client()

    @patch("favorite.connectDatabase")
    def test_addFavorite_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.post('/addFavorite', json={"user_id": 12, "favorite_problems": 60})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Favorite added successfully."})

    def test_addFavorite_400(self):
        response = self.client.post('/addFavorite', json={"user_id": 12})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("favorite.connectDatabase")
    def test_addFavorite_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.post('/addFavorite', json={"user_id": 12, "favorite_problems": 60})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("favorite.pagination")
    @patch("favorite.connectDatabase")
    def test_getFavorite_200(self, mock_connectDatabase, mock_pagination):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        favorite_problems = [[3, 12, 100]]
        mock_cursor.fetchall.return_value = favorite_problems

        mock_response = [[100, 12, "Convert to Str", "Write a funtion that converts an array into strings", "Tues, 29 Apr", False]]
        mock_cursor.fetchall.return_value = mock_response

        pagination = {
            "current_page": 1,
            "per_page": 5,
            "total_items": 1,
            "total_pages": 1
        }

        mock_pagination.return_value =  {"data": mock_response, "pagination": pagination }

        response = self.client.get("/getFavorite?user_id=12")
        self.assertEqual(response.get_json(), {"data": mock_response, "pagination": pagination})

    def test_getFavorite_400(self):
        response = self.client.get("/getFavorite")
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information"})

    @patch("favorite.connectDatabase")
    def test_getFavorite_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception ("Database failed.")
        response = self.client.get("/getFavorite?user_id=12")
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("favorite.connectDatabase")
    def test_updateFavorite_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.put('/updateFavorite', json={"user_id": 12, "favorite_id": 20, "name": "arr"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Favorite updated successfully."})

    def test_updateFavorite_400(self):
        response = self.client.put('/updateFavorite', json={"user_id": 12, "favorite_id": 20})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("favorite.connectDatabase")
    def test_updateFavorite_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")

        response = self.client.put('/updateFavorite', json={"user_id": 12, "favorite_id": 20, "name": "arr"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch("favorite.connectDatabase")
    def test_deleteFavorite_200(self, mock_connectDatabase):
        mock_connection = MagicMock()
        mock_cursor = MagicMock()

        mock_connectDatabase.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.delete('/deleteFavorite', json={"user_id": 12, "favorite_id": 20})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "Favorite deleted successfully."})

    def test_deleteFavorite_400(self):
        response = self.client.delete("/deleteFavorite", json={"user_id": 12})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch("favorite.connectDatabase")
    def test_deleteFavorite_500(self, mock_connectDatabase):
        mock_connectDatabase.side_effect = Exception("Database failed.")
        response = self.client.delete("/deleteFavorite", json={"user_id": 12, "favorite_id": 20})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})
if __name__ == "__main__":
    unittest.main()