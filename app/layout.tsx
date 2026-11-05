import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DXN Resort – Guest Feedback Application",
  description: "Official Guest Experience & Quality Assurance Portal for DXN Resort",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-pink-100 selection:text-royal-pink">
        {children}
      </body>
    </html>
  );
}

