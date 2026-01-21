import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  );
}

