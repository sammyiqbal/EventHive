import "./globals.css";
import { AuthProvider } from "../contexts/auth-context";
import { AuthGuard } from "../components/auth-guard";
import { LayoutShell } from "../components/layout-shell";

export const metadata = {
  title: "EventHive",
  description: "Curated event management made sleek and effortless."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen text-slate-100 selection:bg-primary-500/40 relative">
        {/* Background Image - High Quality */}
        <div 
          className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-fixed -z-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3840&q=100')",
            imageRendering: "high-quality"
          }}
        />
        {/* Light Gradient Overlay - Only for readability, very subtle */}
        <div className="fixed inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/20 -z-10" />
        <AuthProvider>
          <AuthGuard>
            <LayoutShell>{children}</LayoutShell>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}

