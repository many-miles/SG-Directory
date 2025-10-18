// src/app/(root)/layout.tsx - Single Toaster configuration
import Navbar from "../../components/Navbar";
import { Toaster } from "../../components/ui/sonner";
import { UserProvider } from "../../context/UserContext";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return ( 
        <UserProvider>
            <main className="min-h-screen font-work-sans bg-[#F7F7F7]">
                <Navbar />
                <div className="flex flex-col min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
                {/* Single Toaster with specific configuration */}
                <Toaster 
                    position="top-center" 
                    richColors
                    closeButton
                    duration={3000}
                />
            </main>
        </UserProvider>
    )
}