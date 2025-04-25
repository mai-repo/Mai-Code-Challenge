"use client"

import { useState, useEffect } from "react";
import { useAppContext } from "components/context";
import { Label, TextInput, Button } from "flowbite-react";
import { HiMail, HiOutlineKey, HiPencil } from "react-icons/hi";
import { reauthenticateWithCredential, EmailAuthProvider, updateEmail, verifyBeforeUpdateEmail } from "firebase/auth";
import { auth } from "lib/firebase";
import { isValidEmail, isStrongPassword } from "utlis/validation";

export default function UserSettings(){

    const { id, uid, load, setLoading, error, setError, data, setValue } = useAppContext()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [link, setLink] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('');

    useEffect(() => {
        setValue('');
    }, []);

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
            alert(result.message)
        } catch (error) {
            alert(error)
        }
    }

    async function ResetPassword(email) {
        if (!isValidEmail(email)) {
            alert("Invalid email format.");
            return;
        }

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
            setLink(data.reset_link)
            setEmail('')
            console.log(data.reset_link)

            if (data.reset_link) {
                const newTab = window.open("", "_blank");
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
            alert(result.message)
        } catch (error) {
            console.log(error)
        }
    }

    async function changeEmail(newEmail, currentPassword) {

        if (!isValidEmail(newEmail)) {
            setError("Invalid email format.");
            alert("Invalid email format.");
            return;
        }

        if (!isStrongPassword(currentPassword)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, and a number.");
            alert("Weak password. Must be 8+ characters, include uppercase, lowercase, and a number.");
            return;
        }

        const user = auth.currentUser;

        setLoading(true);
        setError("");

        try {
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
        <section className="flex flex-col justify-center items-center max-w-1/2  mx-50 p-12 bg-white border-2 border-black ">
            <div className="flex flex-col justify-center items-center w-full">
                <section className="w-full">
                    <div className="text-2xl mb-2">Change Name and Password</div>
                    <Label className="text-lg">Name</Label>
                    <div className="flex justify-between gap-5">
                        <TextInput id="name" type="name" placeholder="Bad Bunny" value={username} onChange={(e) => setUsername(e.target.value)} className="mb-3 w-3/4"required icon={HiPencil}/>
                        <Button onClick={() => updateUsername(id, username)} className="w-1/6 text-lg bg-teal-500">Reset</Button>
                    </div>
                </section>
                <section className="w-full">
                    <Label className="text-lg">Generate a new Password Link: Enter your email</Label>
                    <div className="flex justify-between mb-12 gap-5">
                        <TextInput id="input" type="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-3/4" icon={HiMail} required/>
                        <Button onClick={() => ResetPassword(email)} className="w-1/6 text-lg  bg-teal-500">Reset</Button>
                    </div>
                    <section className="w-full mb-12">
                        <div className="text-2xl mb-2"> Change Email </div>
                        <Label className="text-lg"> New Email</Label>
                        <TextInput id="email" type="email" placeholder="name@gmail.com" value={newEmail} onChange={(e)=> setNewEmail(e.target.value)} className="mb-3 w-3/4" icon={HiMail}required/>
                        <Label className="text-lg">Password</Label>
                        <TextInput id="password" type="password" placeholder="Enter Password" value={currentPassword} onChange={(e)=> setCurrentPassword(e.target.value)} className="mb-3 w-3/4" icon={HiOutlineKey}required/>
                        <Button onClick={() => changeEmail(newEmail, currentPassword)} className="w-1/4 text-lg bg-green-600">Reset</Button>
                    </section>
                    <div className="text-2xl"> Delete Account  </div>
                    <Button onClick={() => DeleteUser(id, uid)} className="w-1/4 bg-red-800 text-xl">Delete</Button>
                </section>
            </div>
        </section>
    )
}