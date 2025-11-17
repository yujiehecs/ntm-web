import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NTM Community Insights",
  description: "Discover organized community knowledge from manually-curated NTM forum discussions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
