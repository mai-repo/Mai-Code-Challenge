"use client"

export default function Register(){
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    async function createUser(email, name, password) {
        if (!email || !name || !password) {
            alert("Please provide the necessary input.");
        }

        try {
            const response = await fetch('https://backendcodechallenge.vercel.app/createUser', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, name, password })
        });
            const data = await response.json();
            console.log("Success:", data);
            alert(data.message);
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    }
    


    return (

    )
}