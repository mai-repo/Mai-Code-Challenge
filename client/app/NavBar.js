"use client"
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavbarLink, Avatar} from "flowbite-react"
import Link from "next/link"
import { useAppContext } from "./context"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function NavBar(){
    const {id, uid, setId, setUid, setData, setValue} = useAppContext()
    const router = useRouter();

    useEffect(() => {
        if (id && uid) {
        }
    }, [id, uid]);

    if (!id) {
    return (
        <Navbar fluid rounded className="p-5 border-b-2 border-black">
        <NavbarBrand as={Link} href="/">
            <img src="/mai_code_challenge_logo.png" className="w-1/3" alt="mai_code_challenge_logo" />
        </NavbarBrand>
        </Navbar>
    );
    }

    return (
        <main>
            <Navbar fluid rounded className="p-5 border-b-2 border-black">
                <NavbarBrand href="/" onClick={(e) => { setId(null); setUid(null); setValue(null); setData(null)}}>
                    <img src="/mai_code_challenge_logo.png" className="pl-8 w-1/3" alt="mai_code_challenge_logo"/>
                </NavbarBrand>
            { id && (
            <section>
                <NavbarToggle/>
                <NavbarCollapse>
                    <section className="flex flex-row justify-center items-center gap-5 pr-9">
                        <NavbarLink  href="/userSettings">Settings</NavbarLink>
                        <NavbarLink  href="/" onClick={(e) => { setId(''); setUid(''); setValue(''); setData([])}}> Sign out </NavbarLink>
                        <Avatar alt="User Profile Image" img="/Profile.png"/>
                    </section>
                </NavbarCollapse>
            </section>
            )}
            </Navbar>
        </main>
    )
}