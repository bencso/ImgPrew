"use client";

import { IconButton, Skeleton } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";
import { LuMoon, LuSun } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function ColorModeSwitcher() {
  const { toggleColorMode, colorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <Skeleton boxSize="8" />;

  return (
    <IconButton onClick={toggleColorMode} variant="outline" size="sm">
      {colorMode === "light" ? <LuSun /> : <LuMoon />}
    </IconButton>
  );
}
