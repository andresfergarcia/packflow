'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Cog, AlertTriangle, Pause, Play, Wrench, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; icon: any; labelKey: string }> = {
  RUNNING: { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/40', border: 'border-emerald-200 dark:border-emerald-800', icon: Play, labelKey: 'machine.running' },
  STOPPED: { color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/40', border: 'border-red-200 dark:border-red-800', icon: Pause, labelKey: 'machine.stopped' },
  MAINTENANCE: { color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/40', border: 'border-amber-200 dark:border-amber-800', icon: Wrench, labelKey: 'machine.maintenance' },
  IDLE: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/40', border: 'border-blue-200 dark:border-blue-800', icon: Clock, labelKey: 'machine.idle' },
};

interface MachineCardProps {
  machine: any;
  compact?: boolean;
  onClick?: () => void;
}

export function MachineCard({ machine, compact, onClick }: MachineCardProps) {
  const { t } = useI18n();
  const status = STATUS_CONFIG[machine?.status] ?? STATUS_CONFIG.IDLE;
  const Icon = status?.icon ?? Cog;
  const progress = (machine?.dailyTarget ?? 0) > 0 ? Math.min(100, ((machine?.dailyProduced ?? 0) / (machine?.dailyTarget ?? 1)) * 100) : 0;
  const alertCount = machine?._count?.alerts ?? 0;
  const incidentCount = machine?._count?.incidents ?? 0;

  return (
    <Card className={`hover:shadow-lg transition-all cursor-pointer border-l-4 ${status.border} ${status.bg}`} onClick={onClick}>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`h-8 w-8 rounded-lg bg-white dark:bg-card flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon className={`h-4 w-4 ${status.color}`} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">{machine?.name ?? 'Unknown'}</h3>
              <p className="text-[10px] text-muted-foreground truncate">{machine?.model ?? ''}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] font-semibold ${status.color} border-current shrink-0`}>{t(status.labelKey)}</Badge>
        </div>

        {!compact && (
          <>
            {machine?.currentProduct && (
              <p className="text-xs text-muted-foreground mb-2 truncate">
                <span className="font-medium">{t('machine.product')}:</span> {machine.currentProduct}
              </p>
            )}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t('machine.production')}</span>
                <span className="font-mono font-medium">{machine?.dailyProduced ?? 0}/{machine?.dailyTarget ?? 0}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">OEE</span>
                <span className="font-mono font-bold text-[#005A9E] dark:text-blue-400">{machine?.oee?.toFixed?.(1) ?? 0}%</span>
              </div>
            </div>
            {(alertCount > 0 || incidentCount > 0) && (
              <div className="flex gap-2 mt-2">
                {alertCount > 0 && (
                  <Badge variant="destructive" className="text-[10px]">
                    <AlertTriangle className="h-3 w-3 mr-1" />{alertCount} {alertCount > 1 ? t('machine.alerts') : t('machine.alert')}
                  </Badge>
                )}
                {incidentCount > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {incidentCount} {incidentCount > 1 ? t('machine.incidents') : t('machine.incident')}
                  </Badge>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
