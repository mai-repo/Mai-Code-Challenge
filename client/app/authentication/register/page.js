"use client"
import { useState } from "react"
import { Label, TextInput, Button } from "flowbite-react"
import Link from "next/link"


export default function Register(){
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    async function createUser(email, name, password) {
        if (!email || !name || !password) {
            alert("Please provide the necessary input.");
        }

        try {
            const response = await fetch('https://backendcodechallenge.vercel.app/createUser',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }
            alert(data.message);
            setEmail('')
            setName('')
            setPassword('')
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <form className="min-h-screen flex items-center justify-center" onSubmit={ (e) => { e.preventDefault(); createUser(email, name, password);}}>
            <section className="m-50 p-20 border-2 border-black bg-white">
                <h1 className="text-2xl"> Registration </h1>
                <div className="mb-4">
                    <Label htmlFor="name">Name</Label>
                    <TextInput id="name" type="text" placeholder="e.g. Bad Bunny" onChange={(e) => setName(e.target.value)} value ={name}required/>
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <TextInput id="email" type="email" addon="@" placeholder="email@gmail.com" onChange={(e) => setEmail(e.target.value)} value={email}required/>
                </div>
                <div className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <TextInput id="password" type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} value={password} required/>
                </div>
                <Button className="mb-4" type="submit">Register</Button>
                <Link href="/" aria-label="Go to sign-in page"> Got an account? Sign-in! </Link>
            </section>
        </form>
    )
}