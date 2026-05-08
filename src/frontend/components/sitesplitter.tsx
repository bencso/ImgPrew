"use client";

import { Splitter, useBreakpointValue } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import Loader from "./loader";
import { LeftSide } from "./sidebar/leftside";

const DEFAULT_SIZES = [20, 80];

export default function SiteSplitter({ children }: { children: ReactNode }) {
  const orientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    lg: "horizontal",
  });
  const isDesktop = orientation === "horizontal";
  const [sizes, setSizes] = useState<number[] | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("splitter-sizes");
    if (stored) {
      setSizes(JSON.parse(stored));
    } else {
      setSizes(DEFAULT_SIZES);
      localStorage.setItem("splitter-sizes", JSON.stringify(DEFAULT_SIZES));
    }
  }, []);

  const handleResizeEnd = (e: any) => {
    setSizes(e.size);
    localStorage.setItem("splitter-sizes", JSON.stringify(e.size));
  };

  if (sizes === null) return <Loader />;

  return (
    <Splitter.Root
      panels={[
        {
          id: "a",
          collapsible: isDesktop,
          collapsedSize: 5,
          minSize: isDesktop ? 15 : 8.5,
          maxSize: isDesktop ? 20 : 8.5,
        },
        { id: "b", minSize: isDesktop ? 85 : 100 },
      ]}
      onResizeEnd={handleResizeEnd}
      borderWidth="1px"
      overflow={"hidden"}
      maxH={"100vh"}
      minH={"100vh"}
      maxW={"100vw"}
      w={"full"}
      h={"full"}
      minW={0}
      defaultSize={sizes}
      orientation={orientation}
    >
      <Splitter.Panel id="a" minW={0} minH={isDesktop ? "100vh" : "full"}>
        <LeftSide isDesktop={isDesktop} />
      </Splitter.Panel>

      {isDesktop && (
        <Splitter.ResizeTrigger id="a:b" minH={isDesktop ? "100vh" : "full"}>
          <Splitter.ResizeTriggerSeparator />
          <Splitter.ResizeTriggerIndicator hidden />
        </Splitter.ResizeTrigger>
      )}

      <Splitter.Panel
        id="b"
        minH={isDesktop ? "100vh" : "full"}
        textStyle="2xl"
      >
        {children}
      </Splitter.Panel>
    </Splitter.Root>
  );
}
