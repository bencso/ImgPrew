"use client";

import dynamic from "next/dynamic";
import Loader from "@/components/loader";

const SiteSplitter = dynamic(() => import("@/components/sitesplitter"), {
  ssr: false,
  loading: () => <Loader />,
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteSplitter>{children}</SiteSplitter>;
}
