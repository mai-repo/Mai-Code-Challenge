"use client"
import { useState } from 'react'
import { useAppContext } from 'components/context'
import { Button } from 'flowbite-react'

export default function Answer() {
    const { id, data, value, setValue, setData } = useAppContext()
    const [result, setResult] = useState([])

    const getAnswer = async() => {

        console.log(data.Challenge, value)
        try {
            const res = await fetch ("https://backendcodechallenge.vercel.app/evaluateAnswer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    challenge: data.Challenge,
                    answer: value
                })
            })
            const resultData = await res.json()
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }
            setResult(resultData.isCorrect)
            const evaluation = resultData.breakdown.join('\n');
            setValue(evaluation)
            alert("Evaluation successful.")
            navigator.clipboard.writeText(value)
        } catch (error) {
            console.error(error.message)
        }
    }

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
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

        } catch (error) {
            console.error(error.message)
        }
    }

    return (
        <>
            <Button  className="text-lg bg-purple-950" onClick={getAnswer}> Evaluate </Button>
            <Button className="text-lg bg-pink-700" onClick={addQuestion}> Save Question </Button>
        </>
    )
}