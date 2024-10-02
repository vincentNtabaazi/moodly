import type { Metadata } from "next";
import { Fugaz_One, Open_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/context/AuthContext";
import Head from "./head"
import LogOut from "@/components/Logout";

const fugaz = Fugaz_One({
   subsets: ["latin"],
   weight: ["400"]
});

const opensans = Open_Sans({
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Moodly",
   description: "Track your daily mood, every day of the year!",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {

   const header = (
      <header className="p-4 sm:p-8 flex items-center justify-between gap-4">
         <Link href={'/'}>
            <h1 className={'text-base textGradient ' + fugaz.className}>Moodly</h1>
         </Link>
         <LogOut />
      </header>
   )

   const footer = (
      <footer className="p-4 sm:p-8 grid place-items-center">
         <p className={'text-indigo-500 ' + fugaz.className}>Created by Vincent</p>
      </footer>
   )

   return (
      <html lang="en">
         <Head/>
         <AuthProvider>
            <body
               className={'w-full max-w-[1000px] mx-auto text-sm sm:text-base min-h-screen flex flex-col text-slate-800 ' + opensans.className}
            >
               {header}
               {children}
               {footer}
            </body>
         </AuthProvider>
      </html>
   );
}
