"use client"
import { useState } from 'react'
import { useAppContext } from 'components/context'
import { Button } from 'flowbite-react'
import { deleteCompleted, updateQuestion, deleteRejected } from 'utils/validation'

export default function Answer() {
    const { id, data, value, setValue, setData, challenge, status, name, problem, setStatus, setEditorLoading} = useAppContext()
    const [result, setResult] = useState(null)

    const getAnswer = async() => {
        setEditorLoading(true)
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
            console.log(resultData)
            alert("Evaluation successful.")
            await navigator.clipboard.writeText(value);
        } catch (error) {
            alert(error+ " Try again!")
        } finally {
            setEditorLoading(false)
        }
    }

    const saveQuestion = async () => {
        if ((status === true && result === true) || (status === false && result === false)) {
            console.log("No action taken. Status and result match.");
            return;
        }
        if (status === false && result === true) {
            updateQuestion(id, problem, name, result);
            deleteRejected(id, problem);
            setStatus('')
        } else if (status === true && result === false) {
            updateQuestion(id, problem, name, result);
            deleteCompleted(id, problem);
            setStatus('')
        } else {
            addQuestion(id, data.Name, data.Challenge, result);
        }
    };

    const addQuestion = async () => {

        if (!id || !data.Name || !data.Challenge || !result){
            alert("Please click evaluate before saving.")
        }
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