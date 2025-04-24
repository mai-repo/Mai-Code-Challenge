"use client"
import { useAppContext } from "components/context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput, Pagination} from "flowbite-react"

export default function Completed(){
    const { id, data, setData, setChallenge } = useAppContext();
    const [name, setName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();


    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        if (!id) return;

        async function getCompleted() {
            console.log(id)
            try {
                const response = await fetch(`https://backendcodechallenge.vercel.app/getCompleted?user_id=${id}&page=${currentPage}`,
                    {
                        method: "GET",
                        headers: {
                            "content-type": "application/json",
                        },
                    }
                );
                const result = await response.json();
                setData(result.data);
                setTotalPage(result.pagination ? result.pagination.total_pages : 1);
            } catch (error) {
                alert("Error fetching completed data:", error);
            }
        }
        getCompleted();
    }, [id, currentPage]);

    function getChallenge(item) {
        setChallenge(item[3]);
        router.push("/challenge");
    }

    async function updateCompleted(name, id, completed_id){
        if (!name.trim()) {
            alert("Please enter a name.");
            return;
        }
        console.log(name, id, completed_id)
        try {
            const response = await fetch ('https://backendcodechallenge.vercel.app/updateCompleted', {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    user_id: id,
                    completed_id: completed_id
                })
            })
            const result = await response.json()
            alert(result.message)
            window.location.reload();
        } catch (error){
            alert(error)
        }
    }

    async function deleteCompleted(id, completed_id){

        try {
            const response = await fetch ("https://backendcodechallenge.vercel.app/deleteCompleted", {
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    user_id: id,
                    completed_id: completed_id
                })
            })
            const result = await response.json()
            alert(result.message)
            setName('')
            window.location.reload();
            return console.log(result)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <div>
            <section className="bg-white mx-50 p-15 border-2 border-black">
                <h1 className="text-4xl mb-10"> Completed Problems</h1>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, key) => (
                        <div key={key} className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); getChallenge(item);}} className="text-xl text-blue-600 hover:underline">
                                <h2>{item[2]}</h2>
                            </a>
                            <p> {item[4]}</p>
                            {editingId === item[0] ? (
                                <div className="flex items-center gap-2">
                                    <TextInput
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter new name"
                                    />
                                    <Button onClick={() => updateCompleted(name, id, item[0])}> Save </Button>
                                    <Button color="gray" onClick={() => {setEditingId(null); setName(''); }}> Cancel </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Button onClick={() => { setEditingId(item[0]); setName(item[2]);}}> Edit </Button>
                                    <Button color="failure" onClick={() => deleteCompleted(id, item[0])}> Delete </Button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No completed challenges found.</p>
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