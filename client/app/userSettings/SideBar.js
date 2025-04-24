"use client"

import { Sidebar, SidebarItems, SidebarItemGroup, SidebarItem } from "flowbite-react"
import { HiOutlineCog, HiOutlineChartPie, HiOutlineHeart, HiOutlineEmojiSad, HiOutlineSparkles, HiOutlineSearch} from "react-icons/hi"

export default function SideBar (){

    return (
    <main className="flex h-screen border-r-2 border-black">
        <Sidebar aria-label="Sidebar with content separator">
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem href="/userSettings" icon={HiOutlineCog} className="text-lg"> User Settings </SidebarItem>
                    <SidebarItem href="/userSettings/completed" icon={HiOutlineSparkles} className="text-lg"> Completed Challenges </SidebarItem>
                    <SidebarItem href="/userSettings/rejected" icon={HiOutlineEmojiSad} className="text-lg"> Rejected Challenge </SidebarItem>
                    <SidebarItem icon={HiOutlineHeart} className="text-lg"> Favorite Challenges </SidebarItem>
                    <SidebarItem icon={HiOutlineChartPie} className="text-lg"> Progress </SidebarItem>
                    <SidebarItem icon={HiOutlineSearch} className="text-lg"> Search </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    </main>
    )
}