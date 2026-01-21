import { ReactNode } from "react";
import { FloatingNeonShapes } from "@/ui2/theme/neonBackground";

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen relative z-10">
      <FloatingNeonShapes />
      {children}
    </div>
  );
}
