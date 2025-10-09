import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import JsonLd from "@/components/json-ld";
import "@/globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "TimeSpot - World Clock & Time Zone Converter",
        template: "%s | TimeSpot",
    },
    description:
        "Track time across multiple time zones with TimeSpot. A beautiful world clock app featuring real-time updates, weather information, and support for cities worldwide. Perfect for remote teams and global travelers.",
    keywords: [
        "world clock",
        "time zones",
        "time converter",
        "global time",
        "timezone tracker",
        "world time",
        "clock app",
        "time zone converter",
        "international time",
        "remote work tools",
    ],
    authors: [{ name: "TimeSpot" }],
    creator: "TimeSpot",
    publisher: "TimeSpot",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: "TimeSpot - World Clock & Time Zone Converter",
        description:
            "Track time across multiple time zones with TimeSpot. A beautiful world clock app featuring real-time updates, weather information, and support for cities worldwide.",
        url: "/",
        siteName: "TimeSpot",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "TimeSpot - World Clock & Time Zone Converter",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "TimeSpot - World Clock & Time Zone Converter",
        description:
            "Track time across multiple time zones with TimeSpot. Beautiful world clock with real-time updates and weather info.",
        images: ["/og-image.png"],
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
        // Add your verification codes here when you have them
        // google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
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
                <JsonLd />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
