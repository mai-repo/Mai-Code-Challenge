from openai import OpenAI
from dotenv import load_dotenv
import json
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)


def generateCodeChallenge():
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content":  """
                    Generate a short and concise coding challenge suitable for a Junior or Entry-Level software engineer.
                    The challenge should involve any of the following: integers, strings, arrays, dictionaries, sets, or simple algorithms (sorting, counting, etc).
                    Do not generate questions focused only on strings. Vary topics such as loops, conditionals, and simple algorithms.



                    Here’s an example of how the response should be structured in JSON format:

                    {
                    "Challenge": "{insert Challenge}",
                    "Name": "{insert name}",
                    "Input": "{insert input}.",
                    "Output": "{insert output}",
                    "Constraints": "{insert constraints}"
                    }

                    Only return valid JSON. Do not include markdown formatting, comments, or extra explanation.
                """
            }
        ]
    )

    codeChallenge = completion.choices[0].message.content
    return json.loads(codeChallenge)

def evaluateProblem(challenge, answer):

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{
                "role": "system",
                "content": "You are a strict code challenge evaluator. Only return valid JSON. Do not use markdown or extra commentary."
            },
            {
                "role": "user",
                "content": f"""
                Given the following coding challenge, evaluate the user-provided solution and explain how it is correct (or not) in 5 detailed steps.
                Provide a boolean 'isCorrect' field indicating if the solution is correct, and return a breakdown in JSON format.

                Challenge:
                {challenge}

                User Answer:
                {answer}

                The response should include the following structure:
                {{
                    "name": Array
                    "isCorrect": true,  # or false depending on the evaluation is a boolean
                    "breakdown": [
                        "Step 1: Description of evaluation step 1",
                        "Step 2: Description of evaluation step 2",
                        "Step 3: Description of evaluation step 3",
                        "Step 4: Description of evaluation step 4",
                        "Step 5: Description of evaluation step 5"
                    ]
                }}
                Only return raw JSON. No markdown, no extra explanation, no preamble.
                """
            }
        ]
    )
    evaluation = completion.choices[0].message.content
    return json.loads(evaluation)
