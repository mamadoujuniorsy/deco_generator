import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "react-hot-toast";
import Providers from "@/lib/context/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interior Design AI - Créez votre espace parfait",
  description:
    "Application d'intelligence artificielle pour la conception d'intérieur. Créez, visualisez et personnalisez vos espaces avec l'IA.",
  keywords:
    "design intérieur, intelligence artificielle, décoration, aménagement, IA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Providers>{children}</Providers>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#00EEFF",
                  secondary: "#fff",
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: "#ff4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
