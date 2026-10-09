import "../styles/globals.css";
import Navbar from "../components/Navbar";
import HeartBackground from "../components/HeartBackground";
import HeartCursor from "../components/HeartCursor";

export const metadata = {
  title: "💖 Love Score Quiz - Couple Compatibility Test",
  description:
    "A cute, baby-pink, heart-themed quiz app where couples answer 15 questions together and discover their Love Score (0–100%) with category breakdown and Google Sheets sync.",
  keywords: "love score, couple quiz, relationship compatibility, cute quiz, romantic quiz",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💖</text></svg>",
  },
};

export const viewport = {
  themeColor: "#FFE4EC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <HeartBackground />
        <HeartCursor />
        <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main style={{ flex: 1, padding: "24px 16px 60px" }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
