"use client"

import { useAppContext } from "components/context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pagination } from "flowbite-react"
import SearchBar from "./SearchBar";

export default function Search (){

    const { id, data, setData, setChallenge, search } = useAppContext()
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const router = useRouter();

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        if (!id) return;
        async function searchQuestion() {
            try {
                const response = await fetch(`https://backendcodechallenge.vercel.app/getProblem?user_id=${id}&page=${currentPage}`, {
                    method: "GET",
                    headers: {
                        "content-type": "application/json"
                    }
                });
                const result = await response.json();
                console.log(result)
                setData(result.data);
                setTotalPage(result.pagination.total_pages)
            } catch (error) {
                alert(error);
            }
        }
        searchQuestion();
    }, [id, currentPage]);

    function getChallenge(item) {
        setChallenge(item[3]);
        router.push("/challenge");
    }

    return (
        <div className="flex flex-col justify-center">
            <section className="bg-white mx-15 p-10 border-2 border-black">
                <h1 className="text-4xl mb-8">Search Question</h1>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, key) => (
                    <div key={key} className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); getChallenge(item); }} className="text-xl text-blue-600 hover:underline">
                            <h2>{item[2]}</h2>
                        </a>
                        <p>{item[4]}</p>
                    </div>
                    ))
                ) : (
                Array.isArray(search) && search.length > 0 ? (
                    search.map((item, key) => (
                        <div key={key} className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
                            <a href="#" onClick={(e) => { e.preventDefault(); getChallenge(item); }} className="text-xl text-blue-600 hover:underline">
                                <h2>{item[2]}</h2>
                            </a>
                        </div>
                    ))
                ) : (
                <p className="text-gray-500 text-lg mt-4">No results found.</p>
                ))}
                <SearchBar/>
            </section>
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination
                    layout="pagination"
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={onPageChange}
                    previousLabel="Go back"
                    nextLabel="Go forward"
                    showIcons
                />
            </div>
    </div>
)}