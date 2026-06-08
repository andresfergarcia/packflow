'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'text-[#005A9E]', trend }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all bg-white dark:bg-card border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className={`text-2xl font-bold font-display tracking-tight mt-1 ${color}`}>{value ?? 0}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
            {trend && <p className="text-xs text-emerald-600 mt-0.5">{trend}</p>}
          </div>
          <div className={`h-10 w-10 rounded-xl bg-gradient-to-br from-[#005A9E]/10 to-[#0078D4]/10 flex items-center justify-center shrink-0`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
