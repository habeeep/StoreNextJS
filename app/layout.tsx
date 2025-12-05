import type { Metadata } from "next";
import "./globals.css";
import { Barlow } from 'next/font/google';
import { ReduxProvider } from "@/components/providers/ReduxProvider";
import { Container } from "@/components/layout/Container/Container";
import { Header } from "@/components/layout/Header/Header";

const barlow = Barlow({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: "Plants Market",
  description: "Цветы для твоего интерьера",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={barlow.variable}>
      <body className="antialiased"> 
        <ReduxProvider>
          <Container>
            <Header />
            <main className="main-content">
              {children}
            </main>
          </Container>
        </ReduxProvider>
      </body>
    </html>
  );
}