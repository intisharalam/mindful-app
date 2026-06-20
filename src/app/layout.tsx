import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { EngagementProvider } from "@/context/EngagementContext";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { getCurrentUserFromCookies } from "@/lib/server/serverAuth";

export const metadata: Metadata = {
  title: "Intent — Intentional Media",
  description: "A media feed that rewards depth and slows down shallow content.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sessionUser = await getCurrentUserFromCookies();
  const initialUser = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email,
        displayName: sessionUser.display_name,
      }
    : null;

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-app-bg">
        <AuthProvider initialUser={initialUser}>
          <AppSettingsProvider>
            <EngagementProvider>
              <TopBar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 min-w-0">{children}</main>
              </div>
              <BottomNav />
            </EngagementProvider>
          </AppSettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
