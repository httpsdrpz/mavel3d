"use client";

import * as React from "react";

export function useSaveShortcut(onSave: () => void, enabled = true) {
  React.useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(event: KeyboardEvent) {
      const isSaveCombo = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s";
      if (!isSaveCombo) return;
      event.preventDefault();
      onSave();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, enabled]);
}
