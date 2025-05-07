"use client"

import { useAppContext } from "components/context"
import { useState } from 'react'
import { Label, Button } from "flowbite-react"

export default function SearchBar(){
    const { id, setSearch, setData} = useAppContext()
    const [searchTerm, setSearchTerm] = useState('')

    async function search(e) {
        e.preventDefault();

        try {
        const response = await fetch(`https://backendcodechallenge.vercel.app/searchQuestions?user_id=${id}&searchTerm=${searchTerm}`, {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData('')
        setSearch(result)
        setSearchTerm('')
        } catch (error) {
        alert("Search failed: " + error);
        }
    }
    return(
        <form className="w-full flex flex-col" onSubmit={search}>
            <Label htmlFor="search" className="text-xl mb-4">Search Bar</Label>
            <input
                id="search"
                className="w-full p-2 mb-4 border border-gray-600 rounded-md"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                required
            />
            <Button type="submit" className="w-fit text-lg">Search</Button>
        </form>
    )
}