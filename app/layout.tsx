import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "../styles.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Dedicated Car Transport Across Western Europe | AUMOREX", template: "%s | AUMOREX transport" },
  description: "AUMOREX provides dedicated, door-to-door car transport between Ireland, the UK, France, Spain, Portugal and other European destinations.",
  icons: {
    icon: [
      { url: "/brand/aumorex/icons/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/aumorex/icons/favicon.ico", sizes: "any" },
    ],
    apple: "/brand/aumorex/icons/icon-180.png",
  },
  manifest: "/brand/aumorex/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#142B3B",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* brand.css is a public asset and must remain available at this stable URL. */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/brand/aumorex/brand.css" />
      </head>
      <body className={manrope.className}>{children}</body>
    </html>
  );
}
