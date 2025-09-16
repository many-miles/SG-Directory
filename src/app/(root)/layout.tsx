// src/app/(root)/layout.tsx
import Navbar from "../../components/Navbar";
import { Toaster } from "../../components/ui/sonner";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return ( 
        <main className="min-h-screen font-work-sans bg-[#F7F7F7]">
            <Navbar />
            <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                {children}
            </div>
            <Toaster position="top-center" />
        </main> 
    )
}