import { type ReactNode } from "react";
import { Header } from "./Header";

export function GeneralLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-6">
            <div className="max-w-6xl mx-auto flex flex-col gap-4">
                <Header />
                <div className="flex flex-col md:flex-row gap-4">
                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </div>
    );
}
