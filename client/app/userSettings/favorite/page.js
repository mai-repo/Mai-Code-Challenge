"use client"
import { useAppContext } from "components/context"
import { useState, useEffect } from "react"

export default function favoritePage(){
    const {id, data, setData} = useAppContext()
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        if (!id) return;
        async function addFavorites(){

            const response = await fetch (`https://backendcodechallenge.vercel.app/getFavorite?user_id=${id}`, {
                method: "GET",
                headers: {
                    "content-type": "application/json"
                }
            })
            const result = await response.json()
            setData(result.data)
            setTotalPage(result.pagination ? result.pagination.total_pages : 1)
            console.log(result)
        }
    addFavorites();
}, [id, currentPage]);

    return(
        <section className="bg-white mx-50 p-15 border-2 border-black">
            <h1 className="text-4xl mb-10"> Favorite Problems</h1>
        </section>
    )
}