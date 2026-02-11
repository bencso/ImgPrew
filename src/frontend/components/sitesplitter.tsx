"use client";

import {
  Box,
  Center,
  Flex,
  Splitter,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useLocalStorage } from "react-use";
import { ReactNode } from "react";
import { LeftSide } from "./sidebar/leftside";

const DEFAULT_SIZES = [20, 80];

export default function SiteSplitter({ children }: { children: ReactNode }) {
  const orientation = useBreakpointValue<"horizontal" | "vertical">({
    base: "vertical",
    lg: "horizontal",
  });
  const isDesktop = orientation === "horizontal";
  const [sizes, setSizes] = useLocalStorage<number[]>("splitter-sizes", DEFAULT_SIZES);


  return (
    <Splitter.Root
      panels={[
        {
          id: "a",
          collapsible: isDesktop,
          collapsedSize: 5,
          minSize: 10,
          maxSize: 20,
        },
        { id: "b", minSize: isDesktop ? 80 : 90 },
      ]}
      onResizeEnd={(e) => setSizes(e.size)}
      borderWidth="1px"
      overflow={"hidden"}
      minH={"100svh"}
      h={"full"}
      defaultSize={sizes}
      orientation={orientation}
    >
      <Splitter.Panel id="a">
        <LeftSide isDesktop={isDesktop} />
      </Splitter.Panel>

      {isDesktop && <Splitter.ResizeTrigger id="a:b">
        <Splitter.ResizeTriggerSeparator />
        <Splitter.ResizeTriggerIndicator hidden />
      </Splitter.ResizeTrigger>}

      <Splitter.Panel id="b" minH={isDesktop ? "100vh" : "full"} h={"full"} boxSize="full" textStyle="2xl">
        {children}
      </Splitter.Panel>
    </Splitter.Root>
  );
}
