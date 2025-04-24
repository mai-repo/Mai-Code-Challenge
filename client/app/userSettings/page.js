"use client"

import { useState } from "react";
import { useAppContext } from "components/context";
import { Label, TextInput, Button } from "flowbite-react";
import { HiMail, HiOutlineKey, HiPencil } from "react-icons/hi";
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "lib/firebase";

export default function UserSettings(){

    const { id, uid, load, setLoading, error, setError, data } = useAppContext()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('');

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
        console.log(data)
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

    async function changeEmail(newEmail, currentPassword) {

        const user = auth.currentUser;

        setLoading(true);
        setError("");

        try {
            console.log(newEmail)
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            await verifyBeforeUpdateEmail(user, newEmail);
            alert("Verification email sent to new address. Please check and confirm before the email can be changed.");
            setLoading(false);
        } catch (error) {
            setError("Error updating email: " + error.message);
            alert(error)
            setLoading(false);
        }
    }

    return (
        <section className="flex flex-col justify-center items-center w-1/2  mx-50 p-15 bg-white border-2 border-black ">
            <div className="flex flex-col justify-center items-center w-full">
                <section className="mb-6 w-full">
                    <div className="text-2xl mb-2">Change Name and Password</div>
                    <Label className="text-lg">Name</Label>
                    <div className="flex justify-between gap-5">
                        <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-3 w-3/4"required icon={HiPencil}/>
                        <Button onClick={() => updateUsername(id, username)} className="w-1/6 text-lg bg-teal-500">Reset</Button>
                    </div>
                </section>
                <section className="mb-6 w-full">
                    <Label className="text-lg">Generate a new Password Link: Enter your email</Label>
                    <div className="flex justify-between gap-5 mb-12">
                        <TextInput id="input" type="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-6 w-3/4" icon={HiMail} required/>
                        <Button onClick={() => ResetPassword(email)} className="w-1/6 text-lg bg-teal-500">Reset</Button>
                    </div>
                    <section className="mb-6 w-full">
                        <div className="text-2xl mb-2"> Change Email </div>
                        <Label className="text-lg"> New Email</Label>
                        <TextInput id="email" type="email" placeholder="name@gmail.com" value={newEmail} onChange={(e)=> setNewEmail(e.target.value)} className="mb-3 w-3/4" icon={HiMail}required/>
                        <Label className="text-lg">Password</Label>
                        <TextInput id="password" type="password" placeholder="Enter Password" value={currentPassword} onChange={(e)=> setCurrentPassword(e.target.value)} className="mb-3 w-3/4" icon={HiOutlineKey}required/>
                        <Button onClick={() => changeEmail(newEmail, currentPassword)} className="w-3/4 mb-12 text-lg bg-green-600">Reset</Button>
                    </section>
                    <div className="text-2xl mb-2"> Delete Account  </div>
                    <Button onClick={() => DeleteUser(id, uid)} className="w-3/4 bg-red-800 text-xl">Delete</Button>
                </section>
            </div>
        </section>
    )
}