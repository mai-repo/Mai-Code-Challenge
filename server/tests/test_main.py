import unittest
from unittest.mock import patch
from main import app

class TestMain(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    @patch("main.generateCodeChallenge")
    def test_getChallenge_success(self, mock_generateCodeChallenge):
        mock_data = {
            "Challenge": "Write a function that takes in a list of integers and returns the sum of all positive numbers in the list.",
            "Name": "Sum of Positive Numbers - Array",
            "Type": "Array",
            "Input": "A list of integers",
            "Output": "The sum of all positive integers in the input list",
            "Constraints": "The input list can be empty or contain negative numbers",
            "Test Cases": [
                {"test_case": "sumPositiveNumbers([1, -2, 3, -4, 5, 6])", "expected": 15},
                {"test_case": "sumPositiveNumbers([-10, -15, 20, 25])", "expected": 45},
                {"test_case": "sumPositiveNumbers([])", "expected": 0}
            ]
        }

        mock_generateCodeChallenge.return_value = mock_data

        response = self.app.get("/generateChallenge")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, mock_data)

    @patch("main.generateCodeChallenge")
    def test_getChallenge_failure(self, mock_generateCodeChallenge):
        mock_generateCodeChallenge.return_value = None

        response = self.app.get("/generateChallenge")

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {"error": "Failed to generate challenge"})

    @patch("main.generateCodeChallenge")
    def test_getChallenge_exception(self, mock_generateCodeChallenge):
        mock_generateCodeChallenge.side_effect = Exception("Test exception")

        response = self.app.get("/generateChallenge")

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {"error": "Test exception"})

    @patch("main.evaluateProblem")
    def test_evaluateAnswer_success(self, mock_evaluateProblem):
        mock_data = {
            "isCorrect": False,
            "feedback": "The provided solution is incomplete as it does not handle edge cases.",
            "suggestions": ["Consider handling empty input lists.", "Add more test cases for negative numbers."]
        }
        mock_evaluateProblem.return_value = mock_data

        payload = {
            "challenge": "Write a function that takes in a list of integers and returns the sum of all positive numbers.",
            "answer": "def sumPositiveNumbers(lst): return sum(x for x in lst if x > 0)"
        }

        response = self.app.post("/evaluateAnswer", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, mock_data)

    @patch("main.evaluateProblem")
    def test_evaluateAnswer_server_error(self, mock_evaluateProblem):
        mock_evaluateProblem.side_effect = Exception("Unexpected server error")

        payload = {
            "challenge": "Write a function that takes in a list of integers and returns the sum of all positive numbers.",
            "answer": "def sumPositiveNumbers(lst): return sum(x for x in lst if x > 0)"
        }

        response = self.app.post("/evaluateAnswer", json=payload)

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {"error": "Unexpected server error"})

    @patch("main.evaluateProblem")
    def test_evaluateAnswer_missing_data(self, mock_evaluateProblem):
        payload = {
            "challenge": "Write a function that takes in a list of integers and returns the sum of all positive numbers."
        }

        response = self.app.post("/evaluateAnswer", json=payload)

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json, {"error": "Missing either challenge or answer"})

if __name__ == "__main__":
    unittest.main()
