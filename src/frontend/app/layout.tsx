import "./globals.css";

import Loader from "@/components/loader";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { LangugeProvider } from "@/providers/languageprovider";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { Suspense } from "react";
import { appFonts } from "../interfaces/appFonts.interface";

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
              <LangugeProvider>
                <Toaster />
                {children}
              </LangugeProvider>
            </Suspense>
          </Provider>
        </WorkSessionProvider>
      </body>
    </html>
  );
}
