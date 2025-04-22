"use client"

import { Sidebar, SidebarItems, SidebarItemGroup, SidebarItem } from "flowbite-react"

export default function SideBar (){

    return (
    <main className="flex h-screen border-r-2 border-black">
        <Sidebar aria-label="Sidebar with content separator">
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem> User Settings </SidebarItem>
                    <SidebarItem> Completed Challenges </SidebarItem>
                    <SidebarItem href="/userSettings/rejected"> Rejected Challenge </SidebarItem>
                    <SidebarItem> Favorite Challenges </SidebarItem>
                    <SidebarItem> Progress </SidebarItem>
                    <SidebarItem> Search </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    </main>
    )
}