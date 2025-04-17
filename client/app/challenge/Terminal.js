"use client"
import { useState } from "react";
import CodeButton from "./CodeButton"


export default function Terminal(){
        const [data, setData] = useState({});

        async function GPTGenerate() {
            try {
                const response = await fetch(
                    "https://backendcodechallenge.vercel.app/generateChallenge"
                );
                const result = await response.json();
                console.log(result)
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

    return (
        <main className="flex flex-col">
            <section className="flex flex-col flex-1">
                <div className="bg-black p-20 h-155 mb-4 text-white overflow-auto rounded-lg">
                {data ? (
                        <div className="mb-6">
                        <p><strong>Name:</strong> {data.Name}</p> <br/>
                        <p><strong>Problem:</strong> {data.Challenge}</p> <br/>
                        <p><strong>Constraints:</strong> {data.Constraints}</p>  <br/>
                        <p><strong>Input:</strong> {data.Input}</p>  <br/>
                        <p><strong>Output:</strong> {data.Output}</p>  <br/>
                        </div>
                    ) : (
                        <p className="text-white italic">Click "Generate Again to Load a Problem"</p>
                    )}
                </div>
                <CodeButton
                GPTGenerate={GPTGenerate}
                Clear = {() => setData("")}
                />
            </section>
        </main>
    )

}