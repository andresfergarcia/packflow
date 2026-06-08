'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFetch } from '@/hooks/use-fetch';
import { useI18n } from '@/lib/i18n/i18n-context';
import { toast } from 'sonner';
import { Wrench, Plus, Clock, Settings, AlertTriangle, CheckCircle, X } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
  REPAIR: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  PREVENTIVE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  PART_CHANGE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  INSPECTION: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  EMERGENCY: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

export function MaintenanceContent() {
  const { data: session } = useSession() || {};
  const { t } = useI18n();
  const { data: reports, loading, refetch } = useFetch('/api/maintenance', []);
  const { data: machines } = useFetch('/api/machines', []);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [form, setForm] = useState({ machineId: '', type: 'REPAIR', title: '', description: '', partsChanged: '', timeSpentMin: '', laborCost: '', partsCost: '' });

  const filtered = filter === 'ALL' ? reports : reports.filter((r: any) => r.type === filter);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, timeSpentMin: parseInt(form.timeSpentMin) || 0, laborCost: parseFloat(form.laborCost) || 0, partsCost: parseFloat(form.partsCost) || 0 }),
      });
      if (!res.ok) throw new Error();
      toast.success(t('maintenance.reportCreated'));
      setShowForm(false);
      setForm({ machineId: '', type: 'REPAIR', title: '', description: '', partsChanged: '', timeSpentMin: '', laborCost: '', partsCost: '' });
      refetch();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2">
            <Wrench className="h-6 w-6" /> {t('maintenance.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('maintenance.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#005A9E] hover:bg-[#004B87]">
          <Plus className="h-4 w-4 mr-2" /> {t('maintenance.newReport')}
        </Button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'REPAIR', 'PREVENTIVE', 'PART_CHANGE', 'INSPECTION', 'EMERGENCY'].map(f => (
          <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm"
            className={filter === f ? 'bg-[#005A9E]' : ''}
            onClick={() => setFilter(f)}>
            {t(`maintenance.type.${f}`)}
          </Button>
        ))}
      </div>

      {/* New Report Form */}
      {showForm && (
        <Card className="border-2 border-[#005A9E]/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              {t('maintenance.newReport')}
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>{t('maintenance.machine')}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.machineId} onChange={e => setForm({...form, machineId: e.target.value})} required>
                  <option value="">{t('common.select')}</option>
                  {machines.map((m: any) => <option key={m.id} value={m.id}>{m.name} - {m.location}</option>)}
                </select>
              </div>
              <div><Label>{t('maintenance.typeLabel')}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  {['REPAIR','PREVENTIVE','PART_CHANGE','INSPECTION','EMERGENCY'].map(t2 => <option key={t2} value={t2}>{t(`maintenance.type.${t2}`)}</option>)}
                </select>
              </div>
              <div className="md:col-span-2"><Label>{t('maintenance.reportTitle')}</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="md:col-span-2"><Label>{t('maintenance.description')}</Label>
                <textarea className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
              </div>
              <div><Label>{t('maintenance.partsChanged')}</Label>
                <Input value={form.partsChanged} onChange={e => setForm({...form, partsChanged: e.target.value})} placeholder="e.g., Feed rollers (x2), Spring" />
              </div>
              <div><Label>{t('maintenance.timeSpent')} (min)</Label>
                <Input type="number" value={form.timeSpentMin} onChange={e => setForm({...form, timeSpentMin: e.target.value})} />
              </div>
              <div><Label>{t('maintenance.laborCost')} (PLN)</Label>
                <Input type="number" step="0.01" value={form.laborCost} onChange={e => setForm({...form, laborCost: e.target.value})} />
              </div>
              <div><Label>{t('maintenance.partsCost')} (PLN)</Label>
                <Input type="number" step="0.01" value={form.partsCost} onChange={e => setForm({...form, partsCost: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-[#005A9E] hover:bg-[#004B87]">{t('common.save')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      {loading ? <p className="text-center text-muted-foreground py-12">{t('common.loading')}</p> : (
        <div className="grid gap-4">
          {filtered.map((r: any) => (
            <Card key={r.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-[#004B87] dark:text-blue-300">{r.title}</h3>
                      <Badge className={TYPE_COLORS[r.type] || ''}>{t(`maintenance.type.${r.type}`)}</Badge>
                      <Badge variant={r.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {r.status === 'COMPLETED' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {r.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Settings className="h-3 w-3" /> {r.machine?.name}</span>
                      <span className="flex items-center gap-1"><Wrench className="h-3 w-3" /> {r.mechanic?.name}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {r.timeSpentMin} min</span>
                      {r.partsChanged && <span>🔧 {r.partsChanged}</span>}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                    {(r.laborCost || r.partsCost) && (
                      <div className="font-medium text-[#004B87] dark:text-blue-300 mt-1">
                        {((r.laborCost || 0) + (r.partsCost || 0)).toFixed(2)} PLN
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">{t('common.noData')}</p>}
        </div>
      )}
    </div>
  );
}
