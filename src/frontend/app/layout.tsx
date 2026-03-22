"use client";

import { Suspense, useEffect, useLayoutEffect, useState } from "react";

import { Provider } from "@/components/ui/provider";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { LangugeProvider } from "@/providers/languageprovider";
import { Toaster } from "@/components/ui/toaster";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { WebsocketProvider } from "@/providers/websocketprovider";
import Loader from "@/components/loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <WebsocketProvider>
          <WorkSessionProvider>
            <Provider>
              <ColorModeProvider>
                <LangugeProvider>
                  <Suspense fallback={<Loader />}>
                    <Toaster />
                    {children}
                  </Suspense>
                </LangugeProvider>
              </ColorModeProvider>
            </Provider>
          </WorkSessionProvider>
        </WebsocketProvider>
      </body>
    </html>
  );
}
