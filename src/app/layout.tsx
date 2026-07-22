import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://dhruvpatel.dev"),
  title: "Dhruv Patel — AI/ML Engineer",
  description:
    "Dhruv Patel — AI/ML Engineer, Jain University Bengaluru. Computer vision, Kubernetes, FastAPI. Building ML systems that ship.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "Computer Vision",
    "FastAPI",
    "Kubernetes",
    "PyTorch",
    "Dhruv Patel",
    "Bengaluru",
  ],
  authors: [{ name: "Dhruv Patel", url: "https://github.com/dptel22" }],
  creator: "Dhruv Patel",
  publisher: "Dhruv Patel",
  applicationName: "Dhruv Patel — Portfolio",
  icons: {
    icon: [{ url: "/portfolio/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/portfolio/favicon.svg"],
    apple: [{ url: "/portfolio/favicon.svg" }],
  },
  manifest: undefined,
  openGraph: {
    title: "Dhruv Patel — AI/ML Engineer",
    description:
      "Building ML systems that ship. Computer vision · Kubernetes · FastAPI.",
    url: "https://dhruvpatel.dev",
    siteName: "Dhruv Patel",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhruv Patel — AI/ML Engineer",
    description:
      "Building ML systems that ship. Computer vision · Kubernetes · FastAPI.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "https://dhruvpatel.dev" },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dhruv Patel",
  jobTitle: "AI/ML Engineer",
  email: "mailto:dhruvpt933@gmail.com",
  url: "https://dhruvpatel.dev",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Jain University, Bengaluru",
  },
  knowsAbout: [
    "Machine Learning",
    "Computer Vision",
    "Deep Learning",
    "Kubernetes",
    "FastAPI",
    "Python",
    "PyTorch",
  ],
  sameAs: [
    "https://github.com/dptel22",
    "https://www.linkedin.com/in/dhruv-patel-949946261/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Portable to Render as static files: Google Fonts <link> + vanilla CSS
            <link> instead of next/font / CSS imports, so the portfolio bundle
            ships unchanged when extracted from this sandbox host. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=STIX+Two+Text:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/portfolio/style.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
