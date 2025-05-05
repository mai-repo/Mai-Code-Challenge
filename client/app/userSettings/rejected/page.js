"use client";

import { useAppContext } from "components/context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Pagination, Spinner} from "flowbite-react";
import { deleteRejected } from "utils/validation";

export default function RejectedProblem() {
    const { id, data, setData, setChallenge, setStatus, setProblem, setName, name, setLoading} = useAppContext();
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        if (!id) return;

        const fetchRejected = async () => {
            try {
                const response = await fetch(
                    `https://backendcodechallenge.vercel.app/getRejected?user_id=${id}&page=${currentPage}`,
                    {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                );
                const result = await response.json();
                setData(result.data);
                setTotalPage(result.pagination.total_pages)
                alert("Successfully grab data!")
            } catch (error) {
                alert("Error fetching rejected data:", error);
            }
        };

        fetchRejected();
    }, [id, currentPage]);

    function getChallenge(item) {
        setChallenge(item[3]);
        setStatus(false);
        setProblem(item[0]);
        setName(item[2]);
        setLoading(false);
        router.push("/challenge");
    }

    async function updateRejected(name, id, rejected_id){
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
            window.location.reload();
            setName('')
        } catch (error){
            alert(error)
        }
    }

    return (
        <div>
            <section className="bg-white mx-15 p-10 border-2 border-black">
                <h1 className="text-4xl mb-10"> Rejected Problems</h1>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, key) => (
                        <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <a href="#" onClick={(e) => { e.preventDefault(); getChallenge(item);}} className="text-xl text-blue-600 hover:underline">
                                <h2>{item[2]}</h2>
                            </a>
                            <p className="flex justify-center items-center"> {new Date(item[4]).toLocaleString()}</p>
                            {editingId === item[0] ? (
                                <div className="flex items-end gap-2 justify-end">
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter new name"
                                    />
                                    <Button onClick={() => updateRejected(name, id, item[0])}> Save </Button>
                                    <Button color="gray" onClick={() => {setEditingId(null); setName(''); }}> Cancel </Button>
                                </div>
                            ) : (
                                <div className="flex items-end gap-2 justify-end">
                                    <Button onClick={() => { setEditingId(item[0]); setName(item[2]);}}> Edit </Button>
                                    <Button color="failure" onClick={() => deleteRejected(id, item[0])}> Delete </Button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <Spinner aria-label="loading spinner" />
                    </div>
                )}
            </section>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination
                layout="paignation"
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={onPageChange}
                previousLabel="Go back"
                nextLabel="Go foward"
                showIcons
                />
            </div>
        </div>
    );
}