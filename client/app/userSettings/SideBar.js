"use client"

import { Sidebar, SidebarItems, SidebarItemGroup, SidebarItem } from "flowbite-react"
import { HiOutlineCog, HiOutlineChartPie, HiOutlineHeart, HiOutlineEmojiSad, HiOutlineSparkles, HiOutlineSearch} from "react-icons/hi"

export default function SideBar (){

    return (
    <main className="flex h-screen border-r-2 border-black">
        <Sidebar aria-label="Sidebar with content separator">
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem href="/userSettings" icon={HiOutlineCog}> User Settings </SidebarItem>
                    <SidebarItem href="/userSettings/completed" icon={HiOutlineSparkles}> Completed Challenges </SidebarItem>
                    <SidebarItem href="/userSettings/rejected" icon={HiOutlineEmojiSad}> Rejected Challenge </SidebarItem>
                    <SidebarItem icon={HiOutlineHeart}> Favorite Challenges </SidebarItem>
                    <SidebarItem icon={HiOutlineChartPie}> Progress </SidebarItem>
                    <SidebarItem icon={HiOutlineSearch}> Search </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    </main>
    )
}