import { Navbar } from "flowbite-react"
export default function NavBar(){

    return (
        <main>
            <Navbar fluid rounded className="p-5 border-b-2 border-black">
                <img src="/mai_code_challenge_logo.png" className="w-1/3"/>
            </Navbar>
        </main>
    )
}