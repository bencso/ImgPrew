"use client";

import { UseKeyboardShortcutArgs } from "@/interfaces/keyboardShortcut.interface";
import { useEffect } from "react";

export function useKeyboardShortcut({
  key,
  onKeyPressed,
  disabled = false,
}: UseKeyboardShortcutArgs) {
  useEffect(() => {
    if (disabled) return;

    function keyDownHandler(e: KeyboardEvent) {
      if (e.key === key) {
        e.preventDefault();
        onKeyPressed();
      }
    }

    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [key, onKeyPressed, disabled]);
}
