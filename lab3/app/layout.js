import "./globals.css";
import Link from "next/link";
import { GamesProvider } from "./GamesContext";

export const metadata = {
  title: "Plagro",
  description: "Plagro store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>
        <GamesProvider>
          <header className="top-bar">
            <Link href="/" style={{ textDecoration: "none", marginRight: "auto" }}>
              <h1>Plagro</h1>
            </Link>
            <button className="top-bar-btn">Zaloguj się</button>
            <button className="top-bar-btn">Wyloguj się</button>
            <button className="top-bar-btn">Koszyk</button>
          </header>
          {children}
        </GamesProvider>
      </body>
    </html>
  );
}
