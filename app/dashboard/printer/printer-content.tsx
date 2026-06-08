'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Printer, Settings, CheckCircle, AlertTriangle, Droplets, Gauge } from 'lucide-react';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';

export function PrinterContent() {
  const { data: configs, loading, refetch } = useFetch<any[]>('/api/printer', []);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { t } = useI18n();

  const handleSave = async () => {
    try {
      await fetch('/api/printer', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...editForm }),
      });
      toast.success(t('printer.updated'));
      setEditing(null);
      refetch();
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <Printer className="h-6 w-6 text-[#005A9E]" />{t('printer.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('printer.desc')}</p>
      </FadeIn>

      <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="p-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
          <Settings className="h-4 w-4 shrink-0" />
          <span>{t('printer.simNote')}</span>
        </CardContent>
      </Card>

      <Stagger staggerDelay={0.05}>
        <div className="grid gap-4">
          {configs?.map?.((config: any) => (
            <StaggerItem key={config?.id}>
              <Card className="hover:shadow-lg transition-all border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold">{config?.machine?.name ?? 'Machine'} - {config?.productName ?? 'Product'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={config?.status === 'OK' ? 'secondary' : 'destructive'} className="text-[10px]">
                          {config?.status === 'OK' ? <><CheckCircle className="h-3 w-3 mr-1" />OK</> : <><AlertTriangle className="h-3 w-3 mr-1" />{config?.status ?? 'Issue'}</>}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => {
                      if (editing === config?.id) { setEditing(null); }
                      else { setEditing(config?.id); setEditForm({ dateFormat: config?.dateFormat, printPosition: config?.printPosition, printSpeed: config?.printSpeed, inkType: config?.inkType }); }
                    }}>
                      <Settings className="h-3 w-3 mr-1" />{editing === config?.id ? t('common.cancel') : t('printer.configure')}
                    </Button>
                  </div>

                  {editing === config?.id ? (
                    <div className="grid grid-cols-2 gap-3 mt-3 p-3 bg-slate-50 dark:bg-muted/50 rounded-lg">
                      <div><Label className="text-xs">{t('printer.dateFormat')}</Label>
                        <select value={editForm?.dateFormat ?? ''} onChange={(e: any) => setEditForm((p: any) => ({...(p ?? {}), dateFormat: e?.target?.value ?? ''}))} className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm mt-1">
                          {['DD/MM/YYYY', 'MM/YYYY', 'DD.MM.YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY'].map((f: string) => <option key={f} value={f}>{f}</option>)}
                        </select>
                      </div>
                      <div><Label className="text-xs">{t('printer.printPosition')}</Label><Input value={editForm?.printPosition ?? ''} onChange={(e: any) => setEditForm((p: any) => ({...(p ?? {}), printPosition: e?.target?.value ?? ''}))} className="mt-1" /></div>
                      <div><Label className="text-xs">{t('printer.printSpeed')}</Label><Input type="number" step="0.1" value={editForm?.printSpeed ?? 0} onChange={(e: any) => setEditForm((p: any) => ({...(p ?? {}), printSpeed: parseFloat(e?.target?.value) || 0}))} className="mt-1" /></div>
                      <div><Label className="text-xs">{t('printer.inkType')}</Label><Input value={editForm?.inkType ?? ''} onChange={(e: any) => setEditForm((p: any) => ({...(p ?? {}), inkType: e?.target?.value ?? ''}))} className="mt-1" /></div>
                      <div className="col-span-2"><Button size="sm" onClick={handleSave} className="w-full bg-[#005A9E] hover:bg-[#004B87]">{t('printer.saveConfig')}</Button></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div className="flex items-center gap-1.5"><Settings className="h-3.5 w-3.5 text-muted-foreground" /><div><p className="text-muted-foreground">{t('printer.format')}</p><p className="font-mono font-medium">{config?.dateFormat ?? 'N/A'}</p></div></div>
                      <div className="flex items-center gap-1.5"><Printer className="h-3.5 w-3.5 text-muted-foreground" /><div><p className="text-muted-foreground">{t('printer.position')}</p><p className="font-medium">{config?.printPosition ?? 'N/A'}</p></div></div>
                      <div className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-muted-foreground" /><div><p className="text-muted-foreground">{t('printer.speed')}</p><p className="font-mono font-medium">{config?.printSpeed ?? 0} m/s</p></div></div>
                      <div className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-muted-foreground" /><div><p className="text-muted-foreground">{t('printer.ink')}</p><p className="font-medium">{config?.inkType ?? 'N/A'}</p></div></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          )) ?? null}
        </div>
      </Stagger>
    </div>
  );
}
