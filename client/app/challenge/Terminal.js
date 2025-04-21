"use client"
import { useState } from "react";
import CodeButton from "./CodeButton"
import { useAppContext } from "components/context";

export default function Terminal(){
        const { id, data, setData } = useAppContext()

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

        async function Scrape() {

            try {
                const response = await fetch (
                    "https://backendcodechallenge.vercel.app/scrape"
                )
                const result = await response.json();
                setData(result);
                console.log(result);
            } catch (error) {
                console.error ("Error fetch data:", error)
            }
        }

        const cleanText = (text) => {
            return text.replace(/\$(.*?)\$/g, (match, p1) => p1);
        };


    return (
        <main className="flex flex-col">
            <section className="flex flex-col flex-1">
                <div className="bg-black p-20 h-155 mb-4 text-white overflow-auto rounded-lg">
                    {data && data.Challenge? (
                        <div className="mb-6 text-2xl">
                            <p><strong>Name:</strong> {data.Name}</p><br />
                            <p><strong>Challenge:</strong> {data.Challenge}</p><br />
                            <p><strong>Constraints:</strong> {data.Constraints}</p><br />
                            <p><strong>Input:</strong> {data.Input}</p><br />
                            <p><strong>Output:</strong> {data.Output}</p><br />
                        </div>
                    ) :
                    data && data.problem_content ? (
                        <div className="mb-6 text-2xl">
                            <p><strong>Problem:</strong> {data.problem_content}</p>
                        </div>
                    ):
                    (<p className="text-white text-2xl italic">Click "Generate Again to Load a Problem"</p>)
                    }
                </div>
                <CodeButton
                    GPTGenerate={GPTGenerate}
                    Clear={() => setData("")}
                    Scrape={Scrape}
                />
            </section>
        </main>
    )

}