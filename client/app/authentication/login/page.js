'use client';

import { getIdToken, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";

export default function login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function getSignIn (email, password) {

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user

            const id_token = await user.getIdToken()
            console.log("Firebase Token:", id_token)

            const request = await fetch ('https://backendcodechallenge.vercel.app/authentication/login', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${id_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: "Token sucessfully sent."})
            })

            const data = await request.json()
            console.log(data);
            if (data.success) {
                alert("User successfully logged in.");
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error.message)
            setError(error)
        } finally{
            setEmail.clear()
            setPassword.clear()
        }

    }

    return (

        <form className="flex flex-col justify-center gap-4" aria-label="sign-in form" onSubmit ={ (e) => {e.preventDefault(); getSignIn(email, password);}}>
            <section className="m-50">
                <div className="mb-2">
                    <Label htmlFor="email"> Email </Label>
                    <TextInput className="w-1/2" id="email" type="email"  addon="@" placeholder="name@gmail.com" value={email} onChange={ (e) => setEmail(e.target.value)} required shadow/>
                </div>
                <div className="mb-2">
                    <Label htmlFor="password" >Password</Label>
                    <TextInput className="w-1/2" id= "password" type="password" placeholder="user-password" value={password} onChange={ (e) => setPassword(e.target.value)} required shadow/>
                </div>
                <Button type="submit"> Sign-In </Button>
            </section>
        </form>

    )
}