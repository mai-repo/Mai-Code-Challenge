"use client"
import { useState } from "react"
import { Label, TextInput, Button } from "flowbite-react"

export default function UpdatePassword() {
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')
    const [success, setSuccess] = useState(false)

    async function UpdatePassword(email) {

        try {
            const response = await fetch ('https://backendcodechallenge.vercel.app/updatePassword',
            {
                method: "PUT",
                headers: {
                        'Content-Type': 'application/json'
                },
                body: JSON.stringify({email})
            })
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }
            setLink(data.reset_link)
            setEmail('')
            setSuccess(true)
        } catch (error) {
            console.log(error.message)
        }

    }

    return (
        <main>
            {!success ? (
                <form className="min-h-screen flex items-center justify-center" onSubmit={(e)=> {e.preventDefault(); UpdatePassword(email)}}>
                    <section className="m-50 p-20 border-2 border-black bg-white">
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <TextInput id="email" type="email" addon="@" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="flex flex-row justify-between">
                            <Button type="submit">Submit</Button>
                            <Button type="button" href="/authentication/login">Cancel</Button>
                        </div>
                    </section>
                </form>
            ):
            (
                <section className="flex flex-col justify-center px-150 gap-4">
                    <div className="m-50 p-20 border-2 border-black bg-white">
                        <Label>Click here the button to reset your password</Label>
                        <Button href={link}  target="_blank" rel="noopener noreferrer"> Submit </Button>
                    </div>
                </section>
            )}
        </main>
    );
}