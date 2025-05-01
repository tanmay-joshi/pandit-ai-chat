import { Toaster } from "sonner";
import { NavigationBar } from "@/components/NavigationBar";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import { LayoutWithHeader } from "@/components/LayoutWithHeader";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-secondary",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background antialiased",
        libreBaskerville.variable
      )}>
        <Providers>
          <NavigationBar />
          <LayoutWithHeader>{children}</LayoutWithHeader>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
