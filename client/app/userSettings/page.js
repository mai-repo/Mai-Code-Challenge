"use client"

import { useState } from "react";
import { useAppContext } from "components/context";
import { Label, TextInput, Button } from "flowbite-react";

export default function UserSettings(){

    const { id, uid } = useAppContext()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')

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

    async function ResetPassword(email) {
        const newTab = window.open("", "_blank");

        try {
            const request = await fetch ('https://backendcodechallenge.vercel.app/updatePassword',
            {
                method: "PUT",
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            })
            const data = await request.json()
            setLink(data.reset_link)
            setEmail('')
            console.log(data.reset_link)

            if (data.reset_link) {
                newTab.location.href = data.reset_link;
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async function DeleteUser(id, uid) {
        try {
            const response = await fetch ("https://backendcodechallenge.vercel.app/deleteUser",
                {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ user_id: id, uid: uid })
                }
            )
            const result = response.json()
            console.log(result.message)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <section className="flex flex-col justify-center items-center w-1/2  mx-50 p-15 bg-white border-2 border-black ">
            <div className="flex flex-col justify-center items-center w-2/3">
                <section className="mb-6 w-full">
                    <Label className="text-lg">Name</Label>
                    <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-3"required/>
                    <Button onClick={() => updateUsername(id, username)} className="bg-teal-500">Reset</Button>
                </section>
                <section className="mb-6 w-full">
                    <Label className="text-lg">Email</Label>
                    <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e)=> setUsername(e.target.value)} className="mb-3"required/>
                </section>
                <section className="mb-6 w-full">
                    <Label className="text-lg">Change Password</Label>
                    <TextInput id="password" type="input" placeholder="Password" value={email} onChange={(e) => setEmail(e.target.value)} className=" mb-3"/>
                    <Button onClick={() => ResetPassword(email)} className="mb-6 bg-teal-500">Reset</Button>
                    <Button onClick={() => DeleteUser(id, uid)} className="w-full bg-red-800">Delete</Button>
                </section>

            </div>
        </section>
    )
}