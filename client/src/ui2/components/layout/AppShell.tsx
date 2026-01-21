import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { useLocation } from "react-router-dom";
import { FloatingNeonShapes } from "@/ui2/theme/neonBackground";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen relative z-10">
      <FloatingNeonShapes />
      {!isAdminRoute && <Navbar />}
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
    </div>
  );
}
