"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onValueChange,
  placeholder = "Buscar produtos...",
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const [internal, setInternal] = React.useState(value ?? "");

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  function handleChange(next: string) {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!onValueChange) {
      router.push(`/produtos?q=${encodeURIComponent(current)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-10"
        aria-label="Buscar produtos"
      />
    </form>
  );
}
