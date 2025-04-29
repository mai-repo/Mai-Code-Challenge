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
        alert("Successfully added!");
    } catch (error) {
        console.log(error)
    }
}

export async function updateQuestion(user_id, id, name, is_correct){

    try {
        const response = await fetch ("https://backendcodechallenge.vercel.app/updateProblem", {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({user_id: user_id, id: id, name: name, is_correct: is_correct})
        })
        const result = await response.json()
        alert("Updated Question")
    } catch (error) {
        console.log(error)
    }
}

export async function deleteRejected(id, rejected_id){

    try {
        const response = await fetch ("https://backendcodechallenge.vercel.app/deleteRejected", {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user_id: id,
                rejected_id: rejected_id
            })
        })
        const result = await response.json()
        window.location.reload();
    } catch (error) {
        alert(error)
    }
}
export async function deleteCompleted(id, completed_id){

    try {
        const response = await fetch ("https://backendcodechallenge.vercel.app/deleteCompleted", {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user_id: id,
                completed_id: completed_id
            })
        })
        const result = await response.json()
        window.location.reload();
        return console.log(result)
    } catch (error) {
        alert(error)
    }
}
