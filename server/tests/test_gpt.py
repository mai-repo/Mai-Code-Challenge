import unittest
from unittest.mock import patch
import GPT

class TestGPT(unittest.TestCase):

    def setUp(self):
        self.challenge = (
            "Write a function that takes in a list of integers and returns "
            "a new list with only the even numbers from the original list."
        )
        self.correct_answer = """
        def evenNumbers(lst):
            return [num for num in lst if num % 2 == 0]
        """
        self.incorrect_answer = """
        def evenNumbers(lst):
            return [num for num in lst if num % 2 != 0]
        """

    @patch('GPT.generateCodeChallenge')
    def test_generateCodeChallenge(self, mock_generateCodeChallenge):

        mock_response = {
            "Challenge": self.challenge,
            "Test Cases": [
                {"test_case": "evenNumbers([1, 2, 3, 4, 5, 6])", "expected": [2, 4, 6]},
                {"test_case": "evenNumbers([10, 15, 20, 25])", "expected": [10, 20]},
                {"test_case": "evenNumbers([])", "expected": []}
            ],
            "Input": "A list of integers.",
            "Output": "A list containing only the even integers from the input list."
        }

        mock_generateCodeChallenge.return_value = mock_response

        result = GPT.generateCodeChallenge()

        self.assertIsInstance(result, dict)
        self.assertIn("Challenge", result)
        self.assertIn("Test Cases", result)
        self.assertIn("Input", result)
        self.assertIn("Output", result)

    @patch('GPT.evaluateProblem')
    def test_evaluateProblem_correct_solution(self, mock_evaluateProblem):
        mock_result = {
            "isCorrect": True,
            "breakdown": ["Step-by-step explanation."]
        }
        mock_evaluateProblem.return_value = mock_result

        result = GPT.evaluateProblem(self.challenge, self.correct_answer)

        self.assertIsInstance(result, dict)
        self.assertTrue(result["isCorrect"])
        self.assertEqual(result, mock_result)

    @patch('GPT.evaluateProblem')
    def test_evaluateProblem_incorrect_solution(self, mock_evaluateProblem):
        mock_result = {
            "isCorrect": False,
            "breakdown": ["Logic error in implementation."]
        }
        mock_evaluateProblem.return_value = mock_result

        result = GPT.evaluateProblem(self.challenge, self.incorrect_answer)

        self.assertIsInstance(result, dict)
        self.assertFalse(result["isCorrect"])
        self.assertEqual(result, mock_result)

if __name__ == "__main__":
    unittest.main()
