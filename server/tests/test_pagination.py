import unittest
from flask import Flask, jsonify, request
import math
from pagination import pagination

class TestPagination(unittest.TestCase):

    def setUp(self):
        self.app = Flask(__name__)

    def test_pagination_200(self):
        items = [(64, 12, 'sum of even integers', 'Test', '4-29-25', True),
                (53, 12, 'array, array, array', 'Test2', '4-29-25', False)]

        with self.app.app_context():
            with self.app.test_request_context('/?page=1'):
                result, status_code = pagination(items, per_page=5)

        expected_result = {
            "data": [
                [64, 12, 'sum of even integers', 'Test', '4-29-25', True],
                [53, 12, 'array, array, array', 'Test2', '4-29-25', False]
            ],
            "pagination": {
                "current_page": 1,
                "per_page": 5,
                "total_items": 2,
                "total_pages": 1
            }
        }

        data = result.get_json()
        self.assertEqual(status_code, 200)
        self.assertEqual(data, expected_result)

if __name__ == "__main__":
    unittest.main()
