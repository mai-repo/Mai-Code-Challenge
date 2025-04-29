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
                    The challenge should involve any data type such as integers, strings, arrays, or other common data structures.
                    The problem should cover a variety of topics and not focus solely on strings.


                    Here’s an example of how the response should be structured in JSON format:

                    {
                    "Challenge": "{insert Challenge}",
                    "Name": "{insert name}",
                    "Type": "Array"
                    "Input": "{insert input}.",
                    "Output": "{insert output}",
                    "Constraints": "{insert constraints}"
                    }

                    Please ensure that the generated JSON file. Return only raw JSON, no markdown, no preamble, no explanation.

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
                "role": "developer",
                "content": "You are the best developer and code challenge evaluator."
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
                Please ensure that the breakdown explains in clear steps why the answer is correct or incorrect.
                """
            }
        ]
    )
    evaluation = completion.choices[0].message.content
    return json.loads(evaluation)
