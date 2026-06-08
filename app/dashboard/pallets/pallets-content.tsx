'use client';

import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Package, MapPin, Clock, CheckCircle, Truck, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

const STATUS_CFG: Record<string, { color: string; icon: any; labelKey: string }> = {
  IN_PROGRESS: { color: 'text-blue-600', icon: Loader2, labelKey: 'pallets.inProgress' },
  COMPLETED: { color: 'text-emerald-600', icon: CheckCircle, labelKey: 'pallets.completed' },
  DISPATCHED: { color: 'text-purple-600', icon: Truck, labelKey: 'pallets.dispatched' },
};

export function PalletsContent() {
  const { data: pallets, loading } = useFetch<any[]>('/api/pallets', []);
  const { t } = useI18n();

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <Package className="h-6 w-6 text-[#005A9E]" />{t('pallets.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('pallets.desc')}</p>
      </FadeIn>

      <div className="grid grid-cols-3 gap-4">
        {['IN_PROGRESS', 'COMPLETED', 'DISPATCHED'].map((s: string) => {
          const cfg = STATUS_CFG[s] ?? STATUS_CFG.IN_PROGRESS;
          const Icon = cfg?.icon;
          const count = pallets?.filter?.((p: any) => p?.status === s)?.length ?? 0;
          return (
            <Card key={s} className="border-0 shadow-sm bg-white dark:bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`h-5 w-5 ${cfg.color}`} />
                <div><p className="text-2xl font-bold font-display">{count}</p><p className="text-xs text-muted-foreground">{t(cfg.labelKey)}</p></div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Stagger staggerDelay={0.04}>
        <div className="grid gap-3">
          {pallets?.map?.((pallet: any) => {
            const cfg = STATUS_CFG[pallet?.status] ?? STATUS_CFG.IN_PROGRESS;
            const Icon = cfg?.icon;
            const progress = (pallet?.targetQuantity ?? 0) > 0 ? ((pallet?.currentQuantity ?? 0) / (pallet?.targetQuantity ?? 1)) * 100 : 0;
            return (
              <StaggerItem key={pallet?.id}>
                <Card className="hover:shadow-lg transition-all border-0 shadow-sm bg-white dark:bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                        <h3 className="text-sm font-semibold font-mono">{pallet?.palletNumber ?? 'N/A'}</h3>
                        <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current`}>{t(cfg.labelKey)}</Badge>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{pallet?.shift ?? 'N/A'}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                      <div><span className="text-muted-foreground">{t('pallets.machine')}:</span> <span className="font-medium">{pallet?.machine?.name ?? 'N/A'}</span></div>
                      <div><span className="text-muted-foreground">{t('pallets.product')}:</span> <span className="font-medium truncate">{pallet?.product?.name ?? 'N/A'}</span></div>
                      <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /><span className="font-medium">{pallet?.location ?? 'N/A'}</span></div>
                      <div className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" /><span>{new Date(pallet?.createdAt ?? Date.now()).toLocaleTimeString()}</span></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={progress} className="h-2 flex-1" />
                      <span className="text-xs font-mono font-medium">{pallet?.currentQuantity ?? 0}/{pallet?.targetQuantity ?? 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          }) ?? null}
        </div>
      </Stagger>
    </div>
  );
}
