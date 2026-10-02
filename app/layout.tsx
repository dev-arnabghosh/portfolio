import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import Script from "next/script";

import { ThemeProvider } from "@/components/theme/ThemeProvider";

import "./globals.css";
import Chatbot from "@/components/chat/Chatbot";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),

    title: "Arnab Ghosh | Full Stack Developer",

    description:
        "Full Stack Developer with 3+ years of experience building web and mobile applications using Java, Spring Boot, React and React Native.",

    keywords: [
        "Arnab Ghosh",
        "Full Stack Developer",
        "Java Developer",
        "Spring Boot Developer",
        "React Developer",
        "React Native Developer",
        "Web Developer",
        "Mobile App Developer",
    ],

    authors: [{ name: "Arnab Ghosh" }],

    creator: "Arnab Ghosh",

    alternates: {
        canonical: "/",
    },

    openGraph: {
        title: "Arnab Ghosh | Full Stack Developer",
        description:
            "Full Stack Developer with 3+ years of experience building web and mobile applications using Java, Spring Boot, React and React Native.",
        type: "website",
        siteName: "Arnab Ghosh | Full Stack Developer",
        locale: "en_US",
    },

    twitter: {
        card: "summary_large_image",
        title: "Arnab Ghosh | Full Stack Developer",
        description:
            "Full Stack Developer with 3+ years of experience building web and mobile applications using Java, Spring Boot, React and React Native.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Arnab Ghosh",
        jobTitle: "Full Stack Developer",
        url: siteUrl,
        description:
            "Full Stack Developer with 3+ years of experience building web and mobile applications using Java, Spring Boot, React and React Native.",
        knowsAbout: [
            "Java",
            "Spring",
            "Spring Boot",
            "React",
            "React Native",
            "JavaScript",
            "TypeScript",
            "Web Development",
            "Mobile App Development",
        ],
    };

    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}>
                <Script
                    id="person-schema"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd),
                    }}
                />

                <ThemeProvider>
                    {children}
                    <Chatbot />
                </ThemeProvider>
            </body>
        </html>
    );
}
