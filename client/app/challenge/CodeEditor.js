"use client"
import { Editor } from "@monaco-editor/react"
import { Button } from "flowbite-react"
import { useAppContext } from "components/context"
import Answer from "./Answer"


export default function CodeEditor() {
    const {value, setValue} = useAppContext()

    const evaluate = async () => {

        try {
            const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    language: "javascript",
                    version: "1.32.3",
                    files: [{
                        content:value
                    }]
                })
            })

            const result = await response.json()
            console.log("Execution Result:", result.run.output)
            alert(result.run.output)

            navigator.clipboard.writeText(value)
        } catch (error) {
            console.error("Error evaluating code:", error)
        }
    }

    return (
        <section>
            <Editor
                height="60vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue={`// Welcome to Mai Code Challenge\n// Once you submit your answer, it will disappear but automatically be copied so you can save it elsewhere.`}
                value ={value}
                onChange={(newValue) => setValue(newValue)}
            />
            <div className="flex flex-row  justify-between mt-4">
                <Button className="text-lg" onClick={evaluate}>Run Code</Button>
                <Answer/>
            </div>
        </section>
    )
}
