import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SplitLayoutProps {
  main: ReactNode;
  sidebar: ReactNode;
  sidebarPosition?: "left" | "right";
  className?: string;
}

export function SplitLayout({ main, sidebar, sidebarPosition = "right", className }: SplitLayoutProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12", className)}>
      {sidebarPosition === "left" ? (
        <>
          <aside className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            {sidebar}
          </aside>
          <main className="lg:col-span-9">{main}</main>
        </>
      ) : (
        <>
          <main className="lg:col-span-9">{main}</main>
          <aside className="lg:col-span-3 lg:sticky lg:top-20 lg:self-start">
            {sidebar}
          </aside>
        </>
      )}
    </div>
  );
}



