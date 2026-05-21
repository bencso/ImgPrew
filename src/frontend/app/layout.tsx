import "./globals.css";

import Loader from "@/components/loader";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { LangugeProvider } from "@/providers/languageprovider";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { Suspense } from "react";
import { appFonts } from "../helper/appFonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontClassNames = appFonts
    .map((font) => font.fontObject.variable)
    .join(" ");

  return (
    <html lang="hu" suppressHydrationWarning className={fontClassNames}>
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
