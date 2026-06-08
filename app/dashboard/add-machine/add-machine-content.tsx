'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n/i18n-context';
import { toast } from 'sonner';
import { PlusCircle, Factory } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddMachineContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', model: '', type: '', location: '', dailyTarget: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/machines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, dailyTarget: parseInt(form.dailyTarget) || 0 }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Error'); }
      toast.success(t('addMachine.success'));
      setForm({ name: '', model: '', type: '', location: '', dailyTarget: '' });
      router.push('/dashboard');
    } catch (err: any) { toast.error(err.message || t('common.error')); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2">
          <PlusCircle className="h-6 w-6" /> {t('addMachine.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('addMachine.subtitle')}</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Factory className="h-5 w-5" /> {t('addMachine.formTitle')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>{t('addMachine.name')} *</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Betti 3" required />
            </div>
            <div><Label>{t('addMachine.model')} *</Label>
              <Input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="e.g., NB/85/28-WSM-SX" required />
            </div>
            <div><Label>{t('addMachine.type')} *</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.type} onChange={e => setForm({...form, type: e.target.value})} required>
                <option value="">{t('common.select')}</option>
                <option value="Packaging">Packaging</option>
                <option value="Vertical Packaging">Vertical Packaging</option>
                <option value="Weight Dosing">Weight Dosing</option>
                <option value="Tableting">Tableting</option>
                <option value="Rotary Press">Rotary Press</option>
                <option value="Packaging Line">Packaging Line</option>
                <option value="Coffee Packaging">Coffee Packaging</option>
              </select>
            </div>
            <div><Label>{t('addMachine.location')}</Label>
              <Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g., Hall A - Line 1" />
            </div>
            <div><Label>{t('addMachine.dailyTarget')}</Label>
              <Input type="number" value={form.dailyTarget} onChange={e => setForm({...form, dailyTarget: e.target.value})} placeholder="0" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={loading} className="bg-[#005A9E] hover:bg-[#004B87]">{loading ? t('common.loading') : t('common.save')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
