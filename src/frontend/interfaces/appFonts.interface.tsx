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

export const Amatic_SC = AmaticFont({
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-amatic_sc",
});

export const Cinzel = CinzelFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const Cormorant_Garamond = CormorantFont({
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-cormorant_garamond",
});

export const Finlandica_Text = FinlandicaFont({
  weight: ["500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-finlandica_text",
});

export const Limelight = LimelightFont({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-limelight",
});

export const Open_Sans = OpenSansFont({
  weight: ["500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-open_sans",
});

export const Playfair_Display = PlayfairFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair_display",
});

export const Prata = PrataFont({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});

export const Roboto = RobotoFont({
  weight: ["500", "700", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-roboto",
});

export const Work_Sans = WorkSansFont({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-work-sans",
});

export const appFonts = [
  {
    id: "amatic_sc",
    name: "Amatic SC",
    weights: ["400", "700"],
    fontObject: Amatic_SC,
  },
  {
    id: "cinzel",
    name: "Cinzel",
    weights: ["500", "600", "700", "800", "900"],
    fontObject: Cinzel,
  },
  {
    id: "cormorant_garamond",
    name: "Cormorant Garamond",
    weights: ["500", "600", "700"],
    fontObject: Cormorant_Garamond,
  },
  {
    id: "finlandica_text",
    name: "Finlandica Text",
    weights: ["500", "600", "700"],
    fontObject: Finlandica_Text,
  },
  {
    id: "limelight",
    name: "Limelight",
    weights: ["400"],
    fontObject: Limelight,
  },
  {
    id: "open_sans",
    name: "Open Sans",
    weights: ["500", "600", "700", "800"],
    fontObject: Open_Sans,
  },
  {
    id: "playfair_display",
    name: "Playfair Display",
    weights: ["500", "600", "700", "800", "900"],
    fontObject: Playfair_Display,
  },
  { id: "prata", name: "Prata", weights: ["400"], fontObject: Prata },
  {
    id: "roboto",
    name: "Roboto",
    weights: ["500", "700", "900"],
    fontObject: Roboto,
  },
  {
    id: "work_sans",
    name: "Work Sans",
    weights: ["500", "600", "700", "800", "900"],
    fontObject: Work_Sans,
  },
];
