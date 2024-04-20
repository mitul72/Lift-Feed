import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextUIProvider from "../context/NextUIProvider";
import LiftFeedNavbar from "@/components/shared/Navbar";
import { AuthContextProvider } from "@/context/auth-context";
import { Toaster } from "react-hot-toast";
import { ThreadProvider } from "@/context/threads";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lift Feed",
  description: "Fitness social media platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="bottom-right" reverseOrder={false} />
        <AuthContextProvider>
          <ThreadProvider>
            <NextUIProvider>
              <LiftFeedNavbar />
              {children}
            </NextUIProvider>
          </ThreadProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
