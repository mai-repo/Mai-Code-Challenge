"use client";

import { useAppContext } from "components/context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react"

export default function RejectedProblem() {
    const { id, data, uid, setData, setChallenge } = useAppContext();
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!id) return;

        const fetchRejected = async () => {
            try {
                const response = await fetch(
                    `https://backendcodechallenge.vercel.app/getRejected?user_id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                );
                const result = await response.json();
                setData(result);
                console.log("Fetched rejected data:", result);
            } catch (error) {
                console.error("Error fetching rejected data:", error);
            }
        };

        fetchRejected();
    }, [id, setData]);

    function getChallenge(item) {
        setChallenge(item[3]);
        router.push("/challenge");
    }

    async function updateChallenge(name, id, rejected_id){
        if (!name.trim()) {
            alert("Please enter a name.");
            return;
        }

        try {
            const response = await fetch ('https://backendcodechallenge.vercel.app/updateRejected', {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    user_id: id,
                    rejected_id: rejected_id
                })
            })
            const result = await response.json()
            alert(result.message)
            setName('')
            return console.log(result)
        } catch (error){
            console.log(error)
        }
    }

    return (
        <section className="bg-white p-4">
            {Array.isArray(data) && data.length > 0 ? (
                data.map((item, key) => (
                    <div key={key} className="flex flex-row justify-between mb-3">
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                getChallenge(item);
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            <h2>{item[2]}</h2>
                        </a>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name here"
                            className="border-black border-2"

                        />
                        <Button onClick={() => updateChallenge(name, id, item[0])}> Update Name </Button>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No rejected challenges found.</p>
            )}
        </section>
    );
}
