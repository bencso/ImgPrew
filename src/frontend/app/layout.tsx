"use client";

import SiteSplitter from "@/components/sitesplitter";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { LangugeProvider } from "@/providers/languageprovider";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { WebsocketProvider } from "@/providers/websocketprovider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body>
        <Provider>
          <ColorModeProvider>
            <LangugeProvider>
              <WebsocketProvider>
                <WorkSessionProvider>
                  <SiteSplitter>
                    <Toaster />
                    {children}
                  </SiteSplitter>
                </WorkSessionProvider>
              </WebsocketProvider>
            </LangugeProvider>
          </ColorModeProvider>
        </Provider>
      </body>
    </html>
  );
}
