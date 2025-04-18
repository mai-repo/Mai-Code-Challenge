"use client"
import { useState } from "react";
import CodeButton from "./CodeButton"
import { useAppContext } from "components/context";

export default function Terminal(){
        const { id, data, setData } = useAppContext()
        const [scrape, setScrape] = useState([])

        async function GPTGenerate() {

            try {
                const response = await fetch(
                    "https://backendcodechallenge.vercel.app/generateChallenge"
                );
                const result = await response.json();
                console.log(result)
                setData(result);
                setScrape('')
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
                setScrape(result);
                console.log(result);
                setData('')
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
                    {data && !scrape.problem_content ? ( // Render data only if scrape is not chosen
                        <div className="mb-6">
                            <p><strong>Name:</strong> {data.Name}</p><br />
                            <p><strong>Challenge:</strong> {data.Challenge}</p><br />
                            <p><strong>Constraints:</strong> {data.Constraints}</p><br />
                            <p><strong>Input:</strong> {data.Input}</p><br />
                            <p><strong>Output:</strong> {data.Output}</p><br />
                        </div>
                    ) : scrape.problem_content ? ( // Render scrape content if scrape is chosen
                        scrape.problem_content.map((problem, index) => (
                            <div key={index}>
                                <p>{cleanText(problem)}</p> <br />
                            </div>
                        ))
                    ) : (
                        <p className="text-white italic">Click "Generate Again to Load a Problem"</p>
                    )}
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