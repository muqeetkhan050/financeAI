'use client'
import { Sidebar } from "@/components/Sidebar";
import {Navbar} from "@/components/Navbar";
import {useSession} from "next-auth/react";
import { ReactNode } from "react";

export function AppShell({children}:{children:ReactNode}){
    const {data:session,status} = useSession();

    if (status === 'loading' || !session) {
        return (
            <div className="flex flex-col h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}