import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { FloatingNeonShapes } from "@/ui2/theme/neonBackground";

interface PublicShellProps {
  children: ReactNode;
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="min-h-screen relative z-10">
      <FloatingNeonShapes />
      <Navbar />
      <main className="flex-1 w-full relative z-10">
        {children}
      </main>
    </div>
  );
}
