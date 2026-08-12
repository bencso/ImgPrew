"use client";

import { IconButton } from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { ColorModeIcon } from "../ui/color-mode";

export default function ColorModeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <IconButton
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="outline"
      aria-label="Témaválasztás"
      size="sm"
      css={{
        _icon: {
          width: "5",
          height: "5",
        },
      }}
    >
      <ColorModeIcon />
    </IconButton>
  );
}
