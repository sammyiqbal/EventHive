import "./globals.css";
import { LayoutShell } from "../components/layout-shell";

export const metadata = {
  title: "EventHive",
  description: "Curated event management made sleek and effortless."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-slate-950 bg-radial-glow text-slate-100 selection:bg-primary-500/40">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

