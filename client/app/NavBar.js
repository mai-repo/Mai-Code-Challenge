import { Navbar, NavbarBrand} from "flowbite-react"
import Link from "next/link"
export default function NavBar(){

    return (
        <main>
            <Navbar fluid rounded className="p-5 border-b-2 border-black">
                <NavbarBrand as={Link} href="/">
                <img src="/mai_code_challenge_logo.png" className="w-1/3" alt="mai_code_challenge_logo"/>
                </NavbarBrand>

            </Navbar>
        </main>
    )
}