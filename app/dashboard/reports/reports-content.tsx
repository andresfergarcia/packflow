'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/animate';
import { FileText, Download, Calendar, BarChart3, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ReportsContent() {
  const { data: machines } = useFetch<any[]>('/api/machines', []);
  const { data: stats } = useFetch<any>('/api/stats', {});
  const [generating, setGenerating] = useState<string | null>(null);
  const { t } = useI18n();

  const REPORT_TYPES = [
    { id: 'daily', labelKey: 'reports.dailyReport', descKey: 'reports.dailyDesc', icon: Calendar, periodKey: 'reports.daily' },
    { id: 'shift', labelKey: 'reports.shiftReport', descKey: 'reports.shiftDesc', icon: Clock, periodKey: 'reports.every4h' },
    { id: 'weekly', labelKey: 'reports.weeklyReport', descKey: 'reports.weeklyDesc', icon: BarChart3, periodKey: 'reports.weekly' },
    { id: 'monthly', labelKey: 'reports.monthlyReport', descKey: 'reports.monthlyDesc', icon: FileText, periodKey: 'reports.monthly' },
  ];

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      toast.success(t('reports.generated'), { description: t('reports.generatedDesc'), duration: 5000 });
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <FileText className="h-6 w-6 text-[#005A9E]" />{t('reports.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('reports.desc')}</p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORT_TYPES.map((report: any) => {
          const Icon = report?.icon ?? FileText;
          return (
            <FadeIn key={report?.id}>
              <Card className="hover:shadow-lg transition-all border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#005A9E]/10 to-[#0078D4]/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-[#005A9E]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold">{t(report?.labelKey) ?? 'Report'}</h3>
                        <Badge variant="outline" className="text-[10px]">{t(report?.periodKey) ?? ''}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{t(report?.descKey) ?? ''}</p>

                      <div className="mt-3 p-3 bg-slate-50 dark:bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div><p className="text-muted-foreground">{t('reports.machines')}</p><p className="font-medium">{machines?.length ?? 0} {t('common.total')}</p></div>
                          <div><p className="text-muted-foreground">{t('reports.production')}</p><p className="font-medium">{stats?.totalProduced ?? 0} units</p></div>
                          <div><p className="text-muted-foreground">OEE</p><p className="font-medium">{stats?.avgOee ?? 0}%</p></div>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button size="sm" className="text-xs bg-[#005A9E] hover:bg-[#004B87]" onClick={() => handleGenerate(report?.id)} disabled={generating === report?.id}>
                          {generating === report?.id ? t('common.generate') : <><Download className="h-3 w-3 mr-1" />{t('reports.generatePDF')}</>}
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs" onClick={() => handleGenerate(report?.id + '-excel')} disabled={!!generating}>
                          <Download className="h-3 w-3 mr-1" />{t('reports.excel')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          );
        })}
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="pb-2"><CardTitle className="text-sm text-[#004B87] dark:text-blue-300">{t('reports.recentReports')}</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[{ title: 'Daily Report - May 4, 2026', type: t('reports.daily'), date: 'May 4, 2026' }, { title: 'Mid-Shift Report - May 5, 10:00', type: 'Shift', date: 'Today 10:00' }, { title: 'Weekly Summary - W18', type: t('reports.weekly'), date: 'Apr 28-May 4' }].map((r: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{r?.title ?? ''}</p>
                    <p className="text-[10px] text-muted-foreground">{r?.date ?? ''}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">{r?.type ?? ''}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
