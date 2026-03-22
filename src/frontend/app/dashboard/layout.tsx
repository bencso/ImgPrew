"use client";

import SiteSplitter from "@/components/sitesplitter";
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
