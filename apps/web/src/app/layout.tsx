import type { Metadata } from "next";
import { Toaster } from "sonner";

import "@repo/ui/globals.css";
import { fontHeading, fontSans } from "../lib/fonts";
import { Providers } from "../modules/layouts/providers";

export const metadata: Metadata = {
  title: "Nimesh Business Management",
  description: "Business & Finance Management System",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster position="bottom-left" />
        </Providers>
      </body>
    </html>
  );
}
