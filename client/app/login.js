'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function loginUser(e) {
        e.preventDefault();
        try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const idToken = await user.getIdToken();

        const response = await fetch('http://192.168.1.203:5432/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
            },
        });

        const result = await response.json();
        console.log(result);

        } catch (error) {
        console.error("Login error:", error.message);
        }
    }

    return (
        <form onSubmit={loginUser}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        </form>
    );
}
