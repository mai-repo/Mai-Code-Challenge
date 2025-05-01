import unittest
from unittest.mock import patch, Mock
from users import users
from flask import Flask

class TestUsers(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        self.app.register_blueprint(users)
        self.client = self.app.test_client()

    def test_updateUserName_400(self):
        response = self.client.put('/updateUsername', json={"username":"kim K"})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error":"Missing field information"})

    @patch('users.connectDatabase')
    def test_updateUserName_200(self, mock_connect):
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.rowcount.return_value == 1

        response = self.client.put('/updateUsername', json={"user_id": 1, "username": "kim k"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "User updated successfully."})

    @patch('users.connectDatabase')
    def test_updateUserName_404(self, mock_connect):
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.rowcount = 0

        response = self.client.put('/updateUsername', json={"user_id": 1, "username": "kim k"})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "No user found to update."})


    @patch('users.connectDatabase')
    def test_updateUserName_500(self, mock_connect):
        mock_connect.side_effect = Exception("Database failed.")

        response = self.client.put('/updateUsername', json={"user_id": 1, "username": "kim k"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    def test_deleteUser_400(self):
        response = self.client.delete('/deleteUser', json={})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing user id"})

    @patch('users.connectDatabase')
    def test_deleteUser_404(self, mock_connect):
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.rowcount = 0

        response = self.client.delete('/deleteUser', json={"user_id": 1, "uid": "333333"})
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"error": "No user found to delete."})

    @patch('users.connectDatabase')
    def test_deleteUser_500(self, mock_connect):
        mock_connect.side_effect = Exception("Database failed.")
        response = self.client.delete("/deleteUser", json={"user_id":1, "uid": "333333"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('users.connectDatabase')
    @patch('users.auth.delete_user')
    def test_deleteUser_200(self, mock_connect, mock_delete_user):
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.rowcount = 1

        response = self.client.delete("/deleteUser", json={"user_id":1, "uid": "333333"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "User deleted successfully."})

    def test_createUser_400(self):
        response = self.client.post('/createUser', json={})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"error": "Missing field information."})

    @patch('users.connectDatabase')
    @patch('users.auth.create_user')
    def test_createUser_200(self, mock_connect, mock_create_user):
        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        response = self.client.post("/createUser", json={"email":"kim@gmail.com", "uid": "333333", "name": "kim k", "password":"11111"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"message": "User created."})

    @patch('users.connectDatabase')
    @patch('users.auth.create_user')
    def test_createUser_500(self, mock_connect, mock_create_user):
        mock_connect.side_effect = Exception("Database failed.")
        response = self.client.post("/createUser", json={"email":"kim@gmail.com", "uid": "333333", "name": "kim k", "password":"11111"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

    @patch('users.connectDatabase')
    @patch('users.auth.verify_id_token')
    def test_login_200(self, mock_token, mock_connect):
        mock_token.return_value = {"uid": "fake-uid"}

        mock_connection = Mock()
        mock_cursor = Mock()
        mock_connect.return_value = mock_connection
        mock_connection.cursor.return_value = mock_cursor

        mock_cursor.fetchone.return_value = (1, "kim k", "fake-uid")

        response = self.client.post('authentication/login', headers={"Authorization": "Bearer some-valid-token"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"id": 1, "name": "kim k", "uid": "fake-uid"})

    def test_login_400(self):
        response = self.client.post('authentication/login', headers={"Authorization": "   "})

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.get_json(), {"error": "Missing ID token"})

    @patch('users.connectDatabase')
    @patch('users.auth.verify_id_token')
    def test_login_500(self,  mock_token, mock_connect):
        mock_token.return_value = {"uid": "fake-uid"}
        mock_connect.side_effect = Exception("Database failed.")
        response = self.client.post('authentication/login', headers={"Authorization": "Bearer Token"})
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.get_json(), {"error": "Database failed."})

if __name__ == "__main__":
    unittest.main()