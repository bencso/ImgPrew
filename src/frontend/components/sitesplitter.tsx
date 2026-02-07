"use client";

import {
  Center,
  Splitter,
} from "@chakra-ui/react";
import { useLocalStorage } from "react-use";
import { ReactNode } from "react";
import { LeftSide } from "./sidebar/leftside";

const DEFAULT_SIZES = [20, 80];

export default function SiteSplitter({ children }: { children: ReactNode }) {
  const orientation = "horizontal";
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
          maxSize: 15,
        },
        { id: "b", minSize: 80 },
      ]}
      onResizeEnd={(e) => setSizes(e.size)}
      borderWidth="1px"
      minH="100vh"
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

      <Splitter.Panel id="b">
        <Center boxSize="full" textStyle="2xl">
          {children}
        </Center>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
