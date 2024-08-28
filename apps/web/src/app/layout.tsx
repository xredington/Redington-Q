import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Doppio_One } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "./storeProvider";

import SessionProvider from "@/context/authProvider/AuthProvider";
import { Toaster } from "@repo/ui/components/ui/sonner";


const doppio = Doppio_One({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "R1",
  description: "R1",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element{
  return (
    <html lang="en">
      <body className={`${doppio.className} bg-[#00ffa9]/10 dark:bg-neutral-800`}>
        <SessionProvider>
          <StoreProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </StoreProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
