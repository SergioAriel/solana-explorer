import { ReactNode } from "react"
import { Search } from "../Search"
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const Layout = ({ children }: { children: ReactNode}) => {
    return (
        <main
        className={`flex min-h-screen flex-col items-center p-10 gap-10 bg-[aliceblue] ${inter.className}`}
      >
            <Search />
            {children}
        </main>
    )
}