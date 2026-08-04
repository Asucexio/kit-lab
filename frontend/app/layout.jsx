import "./globals.css";
import { AuthProvider } from "../lib/auth-context";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "kit/ — a registry for the components you actually ship",
  description: "Browse, preview, and install UI components published by other developers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-sans text-ink bg-grid bg-grid">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 pb-24">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
