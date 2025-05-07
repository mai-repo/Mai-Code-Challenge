"use client"
import CodeButton from "./CodeButton"
import { useAppContext } from "components/context";
import { addFavorites } from "utils/validation";
import { Spinner } from "flowbite-react";

export default function Terminal(){
        const { id, data, setData, challenge, setChallenge, loading, setLoading} = useAppContext()
        async function GPTGenerate() {
            setLoading(true);
            try {
                const response = await fetch(
                    "https://backendcodechallenge.vercel.app/generateChallenge"
                );
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'An error occurred');
                }
                setData(result);
                console.log(result)
                setChallenge(result.Challenge)
                console.log(challenge)
                alert("Successfully generate Challenge")
            } catch (error) {
                alert("Error fetching data:", error);
            }finally {
                setLoading(false);
            }
        }

        async function Scrape() {
            setLoading(true);

            try {
                const response = await fetch (
                    "https://backendcodechallenge.vercel.app/scrape"
                )
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'An error occurred');
                }
                const combined = result.problem_content.join("\n");
                setData(combined);
                setChallenge(combined);
                alert('Successfully grabbed the data.')
            } catch (error) {
                alert(error)
            } finally {
                setLoading(false);
            }
        }


        const cleanText = (text) => {
            return text.replace(/\$(.*?)\$/g, (match, p1) => p1);
        };

    return (
        <main className="flex flex-col h-full w-full">

            <div className="bg-black p-15 h-full mb-4 text-white overflow-auto">
            { loading && (
                <div className="text-center">
                    <Spinner aria-label="loading spinner"/>
                </div>) }
            {data.question_id && (
                <div className="w-full flex justify-end">
                    <img className="w-1/20" src="/favorite.png" alt="heart emoji" onClick={() => addFavorites(id, data.question_id)}/>
                </div>
            )}
                {data && data.Challenge? (
                    <div className="mb-6 text-2xl">
                        <p><strong>Name:</strong> {data.Name}</p><br />
                        <p><strong>Challenge:</strong> {data.Challenge}</p><br />
                        <p><strong>Constraints:</strong> {data.Constraints}</p><br />
                        <p><strong>Input:</strong> {data.Input}</p><br />
                        <p><strong>Output:</strong> {data.Output}</p><br />
                    </div>
                ) :
                data && challenge ? (
                    <div className="mb-6 text-2xl">
                        <p><strong>Problem:</strong> {cleanText(challenge)}</p>
                    </div>
                ):
                challenge ? (
                    <p className="text-2xl"> {challenge} </p>
                ):
                (<p className="text-white text-2xl italic">Click "Generate Again to Load a Problem"</p>)
                }
            </div>
            <CodeButton
                GPTGenerate={GPTGenerate}
                Clear={() => setData("")}
                Scrape={Scrape}
            />
        </main>
    )

}