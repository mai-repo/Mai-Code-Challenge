'use client';

import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import React, { useState, useEffect} from "react";
import { Label, TextInput, Button } from "flowbite-react";
import Link from "next/link";
import { useAppContext } from "../../context"
import { useRouter } from "next/router";

export default function login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {  setId,  setUid} = useAppContext()

    async function getSignIn (email, password) {

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user

            const id_token = await user.getIdToken()

            const request = await fetch ('https://backendcodechallenge.vercel.app/authentication/login', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${id_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: "Token sucessfully sent."})
            })

            const data = await request.json()
            setEmail('')
            setPassword('')
            setId(data.id)
            setUid(data.uid)
            router.push('/challenge')
            alert("User successfully logged in.");
        } catch (error) {
            console.error(error.message)
        }
    }

    return (

        <form className="flex flex-col justify-center px-150 gap-4" aria-label="sign-in form" onSubmit ={ (e) => {e.preventDefault(); getSignIn(email, password);}}>
            <section className="m-50 p-20 border-2 border-black bg-white">
                <div className="mb-4">
                    <Label htmlFor="email"> Email </Label>
                    <TextInput  id="email" type="email"  addon="@" placeholder="name@gmail.com" value={email} onChange={ (e) => setEmail(e.target.value)} required shadow/>
                </div>
                <div className="mb-4">
                    <Label htmlFor="password" >Password</Label>
                    <TextInput id= "password" type="password" placeholder="user-password" value={password} onChange={ (e) => setPassword(e.target.value)} required shadow/>
                </div>
                <div className="mb-4">
                <Button type="submit"> Sign-In </Button>
                </div>
                <div className="flex flex-row justify-between">
                    <Link href="/authentication/forgot">Forgot password</Link>
                    <Link href="/authentication/register">Register</Link>
                </div>
            </section>
        </form>

    )
}