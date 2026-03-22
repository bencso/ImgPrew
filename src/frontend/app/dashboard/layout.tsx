"use client";

import SiteSplitter from "@/components/sitesplitter";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { WorkSessionProvider } from "@/providers/sessionprovider";
import { WebsocketProvider } from "@/providers/websocketprovider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider>
      <WebsocketProvider>
        <WorkSessionProvider>
          <SiteSplitter>
            <Toaster />
            {children}
          </SiteSplitter>
        </WorkSessionProvider>
      </WebsocketProvider>
    </Provider>
  );
}
