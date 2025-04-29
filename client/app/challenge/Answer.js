"use client"
import { useState } from 'react'
import { useAppContext } from 'components/context'
import { Button } from 'flowbite-react'
import { deleteCompleted, updateQuestion, deleteRejected } from 'utils/validation'

export default function Answer() {
    const { id, data, value, setValue, setData, challenge, status, name, problem } = useAppContext()
    const [result, setResult] = useState([])

    const getAnswer = async() => {
        try {
            const response = await fetch ("https://backendcodechallenge.vercel.app/evaluateAnswer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    challenge: challenge,
                    answer: value
                })
            })
            const resultData = await response.json()
            if (!response.ok) {
                throw new Error(data.error);
            }
            setResult(resultData.isCorrect)
            const evaluation = resultData.breakdown.join('\n');
            setValue(evaluation)
            alert("Evaluation successful.")
        } catch (error) {
            alert(error+ " Try again!")
        }
    }

    const saveQuestion = async () => {
        if (status === false && result === true) {
            updateQuestion(id, problem, name, result);
            deleteRejected(id, problem);
            console.log(id, problem, name, result);
        } else if (status === true && result === false) {
            updateQuestion(id, problem, name, result);
            deleteCompleted(id, problem);
        } else if (status === undefined || status === null) {
            addQuestion();
        }
    };

    const addQuestion = async () => {
        try {
            const res = await fetch ("https://backendcodechallenge.vercel.app/addProblem", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: id,
                    name: data.Name,
                    problem: data.Challenge,
                    is_correct: result
                })
            })
            const response = await res.json()
            setData(response)
            alert(response.message)
        } catch (error) {
            alert(error)
        }
    }
    return (
        <>
            <Button  className="text-lg bg-purple-950" onClick={getAnswer}> Evaluate </Button>
            <Button className="text-lg bg-pink-700" onClick={saveQuestion}> Save Question </Button>
        </>
    )
}