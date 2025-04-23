"use client"

import { useState } from "react";
import { useAppContext } from "components/context";
import { Label, TextInput, Button } from "flowbite-react";

export default function UserSettings(){

    const { id } = useAppContext()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function updateUsername(id, username) {

        try {
            const response = await fetch ("https://backendcodechallenge.vercel.app/updateUsername", {
                method: "PUT",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ user_id: id, username:username})
            });
            const result = await response.json()
            console.log(result.message)
            alert(result.message)
        } catch (error) {
            alert(error)
        }
    }

    return (
        <>
            <section>
                <Label>Name</Label>
                <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e)=> setUsername(e.target.value)} className="w-1/2 mb-3"required/>
                <Button onClick={() => updateUsername(id, username)} className="bg-teal-500">Reset</Button>
            </section>
            <section>
                <Label>Email</Label>
                {/* <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e)=> setUsername(e.target.value)} className="w-1/2 mb-3"required/> */}
            </section>
            <section>
                <Label>Password</Label>
                <TextInput id="password" type="password" placeholder="any password" value={} onChange={(e) => }></TextInput>
            </section>

        </>
    )
}