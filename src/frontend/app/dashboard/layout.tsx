"use client";

import SiteSplitter from "@/components/sitesplitter";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteSplitter>
      <Toaster />
      {children}
    </SiteSplitter>
  );
}
