import type { Metadata } from "next";
import {
  Playfair_Display,
  Cormorant_Garamond,
  Jost,
  Original_Surfer,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-accent",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const originalSurfer = Original_Surfer({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-surfer",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Equila Travel — Premium Cab Services Across India | Book Online",
    template: "%s | Equila Travel",
  },
  description:
    "Equila Travel offers premium cab services across India — city rides, airport transfers, outstation trips, and hourly rentals. Book Equila Travel cabs online. Professional drivers, GPS-tracked vehicles, 24/7 support.",
  keywords: [
    "Equila Travel",
    "equila travel",
    "equilatravel",
    "Equila Travel cab",
    "equila travel booking",
    "equilatravel.com",
    "cab service India",
    "premium taxi service",
    "airport transfer India",
    "outstation cab booking",
    "luxury car rental India",
    "city cab service",
    "corporate travel India",
    "online cab booking",
    "Equila Travel contact",
    "book cab online",
  ],
  authors: [{ name: "Equila Solutions Pvt Ltd" }],
  creator: "Equila Solutions Pvt Ltd",
  publisher: "Equila Solutions Pvt Ltd",
  metadataBase: new URL("https://www.equilatravel.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.equilatravel.com",
    siteName: "Equila Travel",
    title: "Equila Travel — Premium Cab Services Across India | Book Online",
    description:
      "Book Equila Travel for premium cab services — city rides, airport transfers, outstation trips, and hourly rentals. Professional drivers, clean vehicles, 24/7 support across India.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Equila Travel — Premium Cab Services Across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Equila Travel — Premium Cab Services Across India | Book Online",
    description:
      "Book Equila Travel for premium cab services — city rides, airport transfers, outstation trips, and hourly rentals across India.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "I29H2nBpJW4SNBfm_BcTBQPTs1mtgQ9O5BCyxDn1C9g",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${jost.variable} ${originalSurfer.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#050a08" />
        <meta name="google-site-verification" content="I29H2nBpJW4SNBfm_BcTBQPTs1mtgQ9O5BCyxDn1C9g" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Equila Travel",
              description: "Premium cab services across India",
              url: "https://www.equilatravel.com",
              telephone: "+91-8796770014",
              email: "Info@equilatravel.com",
              image: "https://www.equilatravel.com/og-image.jpg",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IN",
              },
              parentOrganization: {
                "@type": "Organization",
                name: "Equila Solutions Pvt Ltd",
                url: "https://www.equilatravel.com",
              },
              serviceType: [
                "City Rides",
                "Airport Transfers",
                "Outstation Trips",
                "Corporate Travel",
                "Hourly Rentals",
              ],
              priceRange: "₹₹",
              openingHours: "Mo-Su 00:00-24:00",
              areaServed: "India",
              sameAs: [
                "https://www.equilatravel.com",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Equila Travel",
              url: "https://www.equilatravel.com",
              description: "Premium cab services across India",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.equilatravel.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="bg-royal-800 text-white overflow-x-hidden">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
