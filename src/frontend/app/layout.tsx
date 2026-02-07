"use client";

import SiteSplitter from "@/components/sitesplitter";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { LocaleProvider } from "@chakra-ui/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body>
        <Provider>
        <ColorModeProvider>
        <LocaleProvider locale="hu-HU">
        <SiteSplitter>
          {children}
          </SiteSplitter>
        </LocaleProvider>
        </ColorModeProvider>
          </Provider>
      </body>
    </html>
  );
}
