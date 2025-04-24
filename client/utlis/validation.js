export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export function isStrongPassword(password) {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
}

export async function addFavorites(id, favorite_problems){
    try {
        const response = await fetch ("https://backendcodechallenge.vercel.app/addFavorite", {
            method:"POST",
            headers: {
                "content-type": "application/json"
            },
            body:JSON.stringify({user_id:id, favorite_problems:favorite_problems})
        })
        const result = await response.json();
        console.log("Result:", result);
        alert("Successfully added!");
    } catch (error) {
        console.log(error)
    }
}