"use client"
import { useAppContext } from "components/context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { Button, TextInput, Pagination, Spinner} from "flowbite-react";

export default function favoritePage(){
    const {id, data, setData, setChallenge, setLoading} = useAppContext()
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();
    const [name, setName] = useState('');

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        if (!id) return;
        async function getFavorites(){
            try {
                const response = await fetch (`https://backendcodechallenge.vercel.app/getFavorite?user_id=${id}&page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                })
                const result = await response.json()
                setData(result.data)
                setTotalPage(result.pagination ? result.pagination.total_pages : 1)
                alert("Successfully grab data!")
            } catch (error) {
                alert(error)
            }
        }
    getFavorites();
}, [id, currentPage]);

    function getChallenge(item) {
        setChallenge(item[3]);
        setLoading(false)
        router.push("/challenge");
    }

    async function updateFavorite(name, id, favorite_id){
        if (!name.trim()) {
            alert("Please enter a name.");
            return;
        }
        try {
            const response = await fetch ('https://backendcodechallenge.vercel.app/updateFavorite', {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    user_id: id,
                    favorite_id: favorite_id
                })
            })
            const result = await response.json()
            alert(result.message)
            window.location.reload();
        } catch (error){
            console.log(error)
        }
    }

    async function deleteFavorite(id, favorite_id){

        try {
            console.log(id, favorite_id)
            const response = await fetch ("https://backendcodechallenge.vercel.app/deleteFavorite", {
                method: "DELETE",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    user_id: id,
                    favorite_id: favorite_id
                })
            })
            const result = await response.json()
            alert(result.message);
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }


    return(
        <div>
        <section className="bg-white mx-15 p-10 border-2 border-black">
            <h1 className="text-4xl mb-10"> Favorite Problems</h1>
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
                                <Button onClick={() => updateFavorite(name, id, item[0])}> Save </Button>
                                <Button color="gray" onClick={() => {setEditingId(null); setName(''); }}> Cancel </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button onClick={() => { setEditingId(item[0]); setName(item[2]);}}> Edit </Button>
                                <Button color="failure" onClick={() => deleteFavorite(id, item[0])}> Delete </Button>
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
)}