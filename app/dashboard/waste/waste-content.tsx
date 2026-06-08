'use client';

import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn } from '@/components/ui/animate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n/i18n-context';

const WasteChart = dynamic(() => import('./waste-chart'), { ssr: false, loading: () => <Skeleton className="h-64 rounded-lg" /> });

const CATEGORY_COLORS: Record<string, string> = {
  Material: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  Product: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  Packaging: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export function WasteContent() {
  const { data: waste, loading } = useFetch<any[]>('/api/waste', []);
  const { t } = useI18n();

  const totalWaste = waste?.reduce?.((s: number, w: any) => s + (w?.quantity ?? 0), 0) ?? 0;
  const byCategory: Record<string, number> = {};
  const byMachine: Record<string, number> = {};
  waste?.forEach?.((w: any) => {
    const cat = w?.category ?? 'Other';
    byCategory[cat] = (byCategory[cat] ?? 0) + (w?.quantity ?? 0);
    const mach = w?.machine?.name ?? 'Unknown';
    byMachine[mach] = (byMachine[mach] ?? 0) + (w?.quantity ?? 0);
  });

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-24 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <Trash2 className="h-6 w-6 text-[#005A9E]" />{t('waste.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('waste.desc')}</p>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-bold font-display text-red-600">{totalWaste?.toFixed?.(1) ?? 0} kg</p><p className="text-xs text-muted-foreground">{t('waste.totalWaste')}</p></CardContent></Card>
        {Object.entries(byCategory ?? {}).map(([cat, qty]: [string, any]) => (
          <Card key={cat} className="border-0 shadow-sm"><CardContent className="p-4 text-center"><p className="text-2xl font-bold font-display">{(qty as number)?.toFixed?.(1) ?? 0} kg</p><p className="text-xs text-muted-foreground">{cat}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><BarChart3 className="h-4 w-4 text-[#005A9E]" />{t('waste.byMachine')}</CardTitle></CardHeader>
          <CardContent className="h-64">
            <WasteChart data={byMachine} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-[#004B87] dark:text-blue-300">{t('waste.recentEntries')}</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">{t('waste.machine')}</TableHead>
                  <TableHead className="text-xs">{t('waste.operator')}</TableHead>
                  <TableHead className="text-xs">{t('waste.category')}</TableHead>
                  <TableHead className="text-xs">{t('waste.qty')}</TableHead>
                  <TableHead className="text-xs">{t('waste.reason')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waste?.slice?.(0, 10)?.map?.((w: any) => (
                  <TableRow key={w?.id}>
                    <TableCell className="text-xs font-medium">{w?.machine?.name ?? 'N/A'}</TableCell>
                    <TableCell className="text-xs">{w?.user?.name ?? 'N/A'}</TableCell>
                    <TableCell><span className={`text-[10px] px-1.5 py-0.5 rounded-full ${CATEGORY_COLORS[w?.category] ?? ''}`}>{w?.category ?? 'N/A'}</span></TableCell>
                    <TableCell className="text-xs font-mono">{w?.quantity?.toFixed?.(1) ?? 0} {w?.unit ?? 'kg'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground truncate max-w-[150px]">{w?.reason ?? 'N/A'}</TableCell>
                  </TableRow>
                )) ?? null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
