import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SITE } from "@/lib/site";
import { isIndexable, siteUrl } from "@/lib/site-url";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});


const DESCRIPTION =
  "Banho, tosa, hidratação e táxi dog com hora marcada em São Paulo. Agende online em poucos passos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE.name} · ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  keywords: ["pet spa", "banho e tosa", "táxi dog", "São Paulo", "Vila Madalena", "agendamento online"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${SITE.name} · ${SITE.tagline}`,
    description: DESCRIPTION,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: DESCRIPTION },
  // Previews e ambiente local não devem aparecer em buscadores.
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#E8833A",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#conteudo"
          className="sr-only z-50 rounded-2xl bg-primary px-4 py-3 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Pular para o conteúdo
        </a>
        <MotionProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
