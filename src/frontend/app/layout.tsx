"use client";

import { Suspense, useEffect, useLayoutEffect, useState } from "react";

import { Provider } from "@/components/ui/provider";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { LangugeProvider } from "@/providers/languageprovider";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
        <Provider>
          <ColorModeProvider>
            <LangugeProvider>
              <Toaster />
              {children}
            </LangugeProvider>
          </ColorModeProvider>
        </Provider>
      </body>
    </html>
  );
}
