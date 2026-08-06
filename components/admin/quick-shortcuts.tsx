import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export interface QuickShortcut {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export function QuickShortcuts({ shortcuts }: { shortcuts: QuickShortcut[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {shortcuts.map((shortcut) => (
        <Link
          key={shortcut.href}
          href={shortcut.href}
          className="group flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <shortcut.icon className="size-4" />
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{shortcut.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{shortcut.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
