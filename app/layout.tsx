import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import "./sam-cleaning.css";

export const metadata: Metadata = {
  title: "Sam Cleaning | Trusted Home and Office Cleaning",
  description:
    "Trusted home and office cleaning with trained staff, eco-friendly products, and flexible weekly plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Nunito+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
        />
      </head>
      <body>
        {children}
        <Script
          src="https://cdn.jsdelivr.net/npm/flatpickr"
          strategy="afterInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/ical.js@1.5.0/build/ical.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
