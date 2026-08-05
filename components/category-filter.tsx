"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: Category | "all";
  onChange: (category: Category | "all") => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  className,
}: CategoryFilterProps) {
  const options: (Category | "all")[] = ["all", ...categories];

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={cn(
            "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
            selected === option
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:bg-secondary hover:text-foreground"
          )}
        >
          {option === "all" ? "Todas as categorias" : option}
        </button>
      ))}
    </div>
  );
}
