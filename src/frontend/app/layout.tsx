import { Suspense } from "react";

import { Provider } from "@/components/ui/provider";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { LangugeProvider } from "@/providers/languageprovider";
import { Toaster } from "@/components/ui/toaster";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import Loader from "@/components/loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>
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
      </body>
    </html>
  );
}
