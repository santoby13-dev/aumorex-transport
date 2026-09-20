import type { Metadata } from "next";
import "../styles.css";

export const metadata: Metadata = {
  title: { default: "AUMOREX transport — Dedicated car transport", template: "%s — AUMOREX transport" },
  description: "Dedicated car transport across Western Europe. Door to door.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
