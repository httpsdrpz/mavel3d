import type { LucideIcon } from "lucide-react";

import { DashboardCard } from "@/components/admin/dashboard-card";

export interface StatCardData {
  label: string;
  value: string | number;
  icon: LucideIcon;
}

export function StatsGrid({ stats }: { stats: StatCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <DashboardCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
