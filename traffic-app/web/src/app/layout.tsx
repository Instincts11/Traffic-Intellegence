import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { StickyBar } from "@/components/sticky-bar";
import { site } from "@/lib/site";
import "./globals.css";

const space = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://traffic.ai"),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${space.variable} ${plex.variable} h-full antialiased`}
    >
      <body className="flex min-h-full max-w-full flex-col overflow-x-clip bg-background font-sans text-foreground">
        <Nav />
        <main className="min-w-0 flex-1 overflow-x-clip pb-16">{children}</main>
        <Footer />
        <StickyBar />
      </body>
    </html>
  );
}
