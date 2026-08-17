import type { Metadata } from "next";
import "@fontsource/baloo-thambi-2/latin-700.css";
import "@fontsource/baloo-thambi-2/latin-800.css";
import "@fontsource/baloo-thambi-2/tamil-700.css";
import "@fontsource/baloo-thambi-2/tamil-800.css";
import "@fontsource/anek-tamil/latin-400.css";
import "@fontsource/anek-tamil/latin-600.css";
import "@fontsource/anek-tamil/latin-700.css";
import "@fontsource/anek-tamil/tamil-400.css";
import "@fontsource/anek-tamil/tamil-600.css";
import "@fontsource/anek-tamil/tamil-700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Farmers' Voice | Mango Belt Movement",
  description: "A bilingual, peaceful and evidence-led movement for mango farmers of the Krishnagiri-Dharmapuri-Bargur belt.",
  other: { "codex-preview": "development" },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ta">
      <body>{children}</body>
    </html>
  );
}
