"use client";

import SiteSplitter from "@/components/sitesplitter";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { LangugeProvider } from "@/providers/languageprovider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body>
        <Provider>
          <ColorModeProvider>
            <LangugeProvider>
                <SiteSplitter>
                  {children}
                </SiteSplitter>
            </LangugeProvider>
          </ColorModeProvider>
        </Provider>
      </body>
    </html>
  );
}
