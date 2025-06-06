"use client"
import { useState } from "react"
import { Label, TextInput, Button, Spinner } from "flowbite-react"
import { useAppContext } from "components/context"

export default function UpdatePassword() {
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')
    const [success, setSuccess] = useState(false)
    const { setLoading, loading } = useAppContext()

    async function UpdatePassword(email) {
        setLoading(true)
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
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            {loading && (
                <div className="text-center">
                    <Spinner aria-label="loading spinner"/>
                </div>) }
            {!success ? (
                <form className="min-h-screen flex items-center justify-center" onSubmit={(e)=> {e.preventDefault(); UpdatePassword(email)}}>
                    <section className="m-50 p-20 border-2 border-black bg-white">
                        <h1 className="text-2xl mb-2">Reset Password</h1>
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <TextInput id="email" type="email" addon="@" placeholder="email@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="flex flex-row justify-between">
                            <Button className="bg-pink-800" type="submit">Submit</Button>
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