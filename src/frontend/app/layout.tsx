import "./globals.css";

import Loader from "@/components/loader";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { LangugeProvider } from "@/providers/languageprovider";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body>
        <WorkSessionProvider>
          <Provider>
            <Suspense fallback={<Loader />}>
              <ColorModeProvider>
                <LangugeProvider>
                  <Toaster />
                  {children}
                </LangugeProvider>
              </ColorModeProvider>
            </Suspense>
          </Provider>
        </WorkSessionProvider>
      </body>
    </html>
  );
}
