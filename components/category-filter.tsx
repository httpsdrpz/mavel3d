"use client";

import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/lib/types";

interface CategoryFilterProps {
  categories: ProductCategory[];
  selected: string | "all";
  onChange: (category: string | "all") => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selected,
  onChange,
  className,
}: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <button
        onClick={() => onChange("all")}
        className={cn(
          "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
          selected === "all"
            ? "bg-primary/10 text-primary"
            : "text-foreground/70 hover:bg-secondary hover:text-foreground"
        )}
      >
        Todas as categorias
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onChange(category.name)}
          className={cn(
            "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors",
            selected === category.name
              ? "bg-primary/10 text-primary"
              : "text-foreground/70 hover:bg-secondary hover:text-foreground"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
