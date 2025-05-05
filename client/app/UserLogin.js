'use client';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "lib/firebase";
import React, { useState} from "react";
import { Label, TextInput, Button } from "flowbite-react";
import Link from "next/link";
import { useAppContext } from "./context"
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/navigation'
import { Spinner } from "flowbite-react";

export default function UserLogin(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setId,  setUid, setLoading, loading} = useAppContext()
    const [token, setToken] = useState(null);
    const router = useRouter()

    async function getSignIn (email, password) {
        setLoading(true)
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredentials.user

            const id_token = await user.getIdToken()

            const response = await fetch ('https://backendcodechallenge.vercel.app/authentication/login', {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${id_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: "Token sucessfully sent."})
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }
            setEmail('')
            setPassword('')
            setId(data.id)
            setUid(data.uid)
            alert("User successfully logged in.");
            router.push("/challenge")
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    async function notARobot(token){
        setLoading(true)
        try {
            setToken(token)
            const response = await fetch('https://backendcodechallenge.vercel.app/verifyUser', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                } else {
                    alert(data.message);
                }
                } catch (error) {
                console.error("reCAPTCHA verification failed:", error);
                alert("An error occurred during reCAPTCHA verification.");
            }   finally {
                setLoading (false)
            }
    }
    return (
        <form className="flex flex-col justify-center item-center gap-4 mx-auto w-full max-w-md" aria-label="sign-in form" onSubmit ={ (e) => {e.preventDefault(); getSignIn(email, password);}}>
        <section className="mt-20 p-20 border-2 border-black bg-white">
        { loading && (
            <div className="text-center">
                <Spinner aria-label="loading spinner"/>
            </div>) }
            <div className="mb-4">
                <Label htmlFor="email"> Email </Label>
                <TextInput  id="email" type="email"  addon="@" placeholder="name@gmail.com" value={email} onChange={ (e) => setEmail(e.target.value)} required shadow/>
            </div>
            <div className="mb-4">
                <Label htmlFor="password" >Password</Label>
                <TextInput id= "password" type="password" placeholder="user-password" value={password} onChange={ (e) => setPassword(e.target.value)} required shadow/>
            </div>
            <div className="flex flex-row justify-between">
                <Link href="/authentication/forgot">Forgot password</Link>
                <Link href="/authentication/register">Register</Link>
            </div>
            <div className="mb-4">
                <ReCAPTCHA
                    sitekey="6LfMmiMrAAAAAHaEHu61G8bGw44bhmuxboKJnRI0"
                    onChange={notARobot}
                    className="mb-4"
                />
            </div>
            <div className="mb-4">
                <Button type="submit">Sign-In</Button>
            </div>
        </section>
        </form>
    )
}
