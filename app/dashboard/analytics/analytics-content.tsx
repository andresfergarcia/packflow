'use client';

import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn } from '@/components/ui/animate';
import { TrendingUp, BarChart3, Activity, LineChart } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n/i18n-context';

const ProductionTrendChart = dynamic(() => import('./production-trend-chart'), { ssr: false, loading: () => <Skeleton className="h-72 rounded-lg" /> });
const MachineComparisonChart = dynamic(() => import('./machine-comparison-chart'), { ssr: false, loading: () => <Skeleton className="h-72 rounded-lg" /> });
const ShiftAnalysisChart = dynamic(() => import('./shift-analysis-chart'), { ssr: false, loading: () => <Skeleton className="h-72 rounded-lg" /> });

export function AnalyticsContent() {
  const { data: logs, loading } = useFetch<any[]>('/api/production-logs', []);
  const { data: machines } = useFetch<any[]>('/api/machines', []);
  const { t } = useI18n();

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-72 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <TrendingUp className="h-6 w-6 text-[#005A9E]" />{t('analytics.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('analytics.desc')}</p>
      </FadeIn>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><LineChart className="h-4 w-4 text-[#005A9E]" />{t('analytics.productionTrend')}</CardTitle></CardHeader>
        <CardContent className="h-72">
          <ProductionTrendChart logs={logs ?? []} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><BarChart3 className="h-4 w-4 text-[#005A9E]" />{t('analytics.machineComparison')}</CardTitle></CardHeader>
          <CardContent className="h-72">
            <MachineComparisonChart machines={machines ?? []} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><Activity className="h-4 w-4 text-[#005A9E]" />{t('analytics.shiftAnalysis')}</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ShiftAnalysisChart logs={logs ?? []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
