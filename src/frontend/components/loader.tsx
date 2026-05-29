"use client";

import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

interface LoaderProps {
  showBg?: boolean;
}
export default function Loader(props: LoaderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Box
      position={"fixed"}
      inset={0}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={(props.showBg ?? true) ? "bg" : "bg/20"}
      zIndex={"max"}
      transition="all"
      animation="fadeIn 300ms ease-in"
    >
      <BeatLoader
        size={12}
        color={(props.showBg ?? true) ? "#004d40" : "#b0fff2"}
      />
    </Box>
  );
}
