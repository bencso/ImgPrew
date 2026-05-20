import "./globals.css";

import Loader from "@/components/loader";
import { ColorModeProvider } from "@/components/ui/color-mode";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { LangugeProvider } from "@/providers/languageprovider";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { Suspense } from "react";

import {
  Amatic_SC as AmaticFont,
  Cinzel as CinzelFont,
  Cormorant_Garamond as CormorantFont,
  Finlandica as FinlandicaFont,
  Limelight as LimelightFont,
  Open_Sans as OpenSansFont,
  Playfair_Display as PlayfairFont,
  Prata as PrataFont,
  Roboto as RobotoFont,
  Work_Sans as WorkSansFont,
} from "next/font/google";

const Amatic_SC = AmaticFont({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-amatic_sc",
});

const Cinzel = CinzelFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

const Cormorant_Garamond = CormorantFont({
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant_garamond",
});

const Finlandica_Text = FinlandicaFont({
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-finlandica_text",
});

const Limelight = LimelightFont({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-limelight",
});

const Open_Sans = OpenSansFont({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-open_sans",
});

const Playfair_Display = PlayfairFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair_display",
});

const Prata = PrataFont({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});

const Roboto = RobotoFont({
  weight: ["500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto",
});

const Work_Sans = WorkSansFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
});

export const appFonts = [
  { id: "amatic_sc", name: "Amatic SC", weights: ["400", "700"], fontObject: Amatic_SC },
  { id: "cinzel", name: "Cinzel", weights: ["500", "600", "700", "800", "900"], fontObject: Cinzel },
  { id: "cormorant_garamond", name: "Cormorant Garamond", weights: ["500", "600", "700"], fontObject: Cormorant_Garamond },
  { id: "finlandica_text", name: "Finlandica Text", weights: ["500", "600", "700"], fontObject: Finlandica_Text },
  { id: "limelight", name: "Limelight", weights: ["400"], fontObject: Limelight },
  { id: "open_sans", name: "Open Sans", weights: ["500", "600", "700", "800"], fontObject: Open_Sans },
  { id: "playfair_display", name: "Playfair Display", weights: ["500", "600", "700", "800", "900"], fontObject: Playfair_Display },
  { id: "prata", name: "Prata", weights: ["400"], fontObject: Prata },
  { id: "roboto", name: "Roboto", weights: ["500", "700", "900"], fontObject: Roboto },
  { id: "work_sans", name: "Work Sans", weights: ["500", "600", "700", "800", "900"], fontObject: Work_Sans },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontClassNames = appFonts.map(font => font.fontObject.variable).join(" ");

  return (
    <html
      lang="hu"
      suppressHydrationWarning
      className={fontClassNames}
    >
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