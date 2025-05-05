"use client"
import { Navbar, NavbarBrand, NavbarCollapse, NavbarToggle, NavbarLink, Avatar} from "flowbite-react"
import Link from "next/link"
import { useAppContext } from "./context"
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar(){
    const {id, uid, clearAll, setLoading, setChallenge, setValue, setEditorValue, setStatus} = useAppContext()
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (id && uid && pathname==='/') {
        router.replace("/challenge")
        }
    }, [id, uid, router, pathname],);

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
            <Navbar fluid rounded className="flex justify-between p-5 border-b-2 border-black">
                <NavbarBrand href="/" onClick={(e) => {clearAll()}} className="w-1/3">
                    <img src="/mai_code_challenge_logo.png" className="pl-8 w-full flex-shrink-0" alt="mai_code_challenge_logo"/>
                </NavbarBrand>
            { id && (
            <section>
                <NavbarToggle/>
                <NavbarCollapse>
                    <section className="flex items-center gap-5">
                        <NavbarLink href="/challenge" onClick={(e) => { setChallenge(''); setStatus(false); setLoading(false); setValue(''); setEditorValue('')}} className="text-lg">Code Challenge</NavbarLink>
                        <NavbarLink href="/userSettings" className="text-lg">Settings</NavbarLink>
                        <NavbarLink  href="/" onClick={(e) => {clearAll();}} className="text-lg"> Sign out </NavbarLink>
                        <Avatar alt="User Profile Image" img="/Profile.png"/>
                    </section>
                </NavbarCollapse>
            </section>
            )}
            </Navbar>
        </main>
    )
}