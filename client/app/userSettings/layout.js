import SideBar from "./SideBar"

export default function RootLayout({ children }) {
    return (
        <div className="flex">
            <SideBar />
            <main className="flex-1 p-20">
                {children}
            </main>
        </div>
    )
}