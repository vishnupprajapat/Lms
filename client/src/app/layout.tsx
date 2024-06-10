"use client";
import { Inter, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import ThemeProvider from "./utils/themeProvider";
import { Toaster } from "react-hot-toast";
import Provider from "./utils/Provider";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Poppins",
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-Josefin",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${josefin.variable} !bg-white bg-no-repeat dark:bg-gradient-to-b dark:from-gray-900 dark:to-black duration-300`}
      >
        <Provider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
