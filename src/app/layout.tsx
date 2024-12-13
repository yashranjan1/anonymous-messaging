import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "@/components/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "messages"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider 
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          
        <AuthProvider>
          <div className="flex min-h-screen flex-col py-4 sm:py-8 px-2 sm:px-6 lg:px-8 font-[family-name:var(--font-geist-sans)] selection:bg-blue-800/10 selection:text-blue-900 mx-2 2xl:mx-80 gap-10 sm:gap-16">
            <NavBar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <Toaster />
          </div>
        </AuthProvider>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
