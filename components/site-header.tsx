"use client";

import { Blocks } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-2">
          <Blocks className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold gradient-text">CryptoVision</span>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}