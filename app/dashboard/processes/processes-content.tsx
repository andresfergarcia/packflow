'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useFetch } from '@/hooks/use-fetch';
import { useI18n } from '@/lib/i18n/i18n-context';
import { toast } from 'sonner';
import { Cog, Plus, X, CheckCircle } from 'lucide-react';

export function ProcessesContent() {
  const { t } = useI18n();
  const { data: processes, loading, refetch } = useFetch('/api/processes', []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: '', steps: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/processes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(t('processes.created'));
      setShowForm(false);
      setForm({ name: '', description: '', category: '', steps: '' });
      refetch();
    } catch { toast.error(t('common.error')); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2">
            <Cog className="h-6 w-6" /> {t('processes.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('processes.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-[#005A9E] hover:bg-[#004B87]">
          <Plus className="h-4 w-4 mr-2" /> {t('processes.addProcess')}
        </Button>
      </div>

      {showForm && (
        <Card className="border-2 border-[#005A9E]/30">
          <CardHeader className="pb-3"><CardTitle className="text-lg flex items-center justify-between">{t('processes.addProcess')}
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
          </CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>{t('processes.name')} *</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div><Label>{t('processes.category')}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="">{t('common.select')}</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Dosing">Dosing</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Quality">Quality</option>
                </select>
              </div>
              <div className="md:col-span-2"><Label>{t('processes.description')}</Label>
                <textarea className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[60px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="md:col-span-2"><Label>{t('processes.steps')}</Label>
                <textarea className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[80px]" value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} placeholder="1. Step one&#10;2. Step two&#10;3. Step three" />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" className="bg-[#005A9E] hover:bg-[#004B87]">{t('common.save')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? <p className="text-center text-muted-foreground py-12">{t('common.loading')}</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {processes.map((p: any) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-[#004B87] dark:text-blue-300">{p.name}</h3>
                  <div className="flex gap-2">
                    {p.category && <Badge variant="secondary">{p.category}</Badge>}
                    <Badge className={p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {p.isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : null}{p.isActive ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>
                </div>
                {p.description && <p className="text-sm text-muted-foreground mt-2">{p.description}</p>}
                {p.steps && (
                  <div className="mt-3 text-xs text-muted-foreground bg-muted/50 rounded p-2 whitespace-pre-line">{p.steps}</div>
                )}
              </CardContent>
            </Card>
          ))}
          {processes.length === 0 && <p className="text-center text-muted-foreground py-8 md:col-span-2">{t('common.noData')}</p>}
        </div>
      )}
    </div>
  );
}
