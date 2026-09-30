import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanonKeeper | Sanity Knowledge Graph & Canon Resolution Engine",
  description: "Fictional Universe Lore & Canon Resolution Engine built for the Sanity MCP Hackathon. Detect retcons, resolve timeline contradictions, and audit evidence graphs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased selection:bg-purple-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
