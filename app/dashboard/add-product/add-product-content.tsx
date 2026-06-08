'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/lib/i18n/i18n-context';
import { toast } from 'sonner';
import { PlusCircle, Boxes } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddProductContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', sku: '', ean: '', category: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Error'); }
      toast.success(t('addProduct.success'));
      setForm({ name: '', sku: '', ean: '', category: '', description: '' });
      router.push('/dashboard/products');
    } catch (err: any) { toast.error(err.message || t('common.error')); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2">
          <PlusCircle className="h-6 w-6" /> {t('addProduct.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('addProduct.subtitle')}</p>
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="h-5 w-5" /> {t('addProduct.formTitle')}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>{t('addProduct.name')} *</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>SKU *</Label>
                <Input value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="e.g., OXO-DW-40" required />
              </div>
              <div><Label>EAN</Label>
                <Input value={form.ean} onChange={e => setForm({...form, ean: e.target.value})} placeholder="e.g., 5901234567001" />
              </div>
            </div>
            <div><Label>{t('addProduct.category')} *</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                <option value="">{t('common.select')}</option>
                <option value="Dishwasher">Dishwasher</option>
                <option value="Laundry">Laundry</option>
                <option value="Toilet">Toilet</option>
                <option value="Descaling">Descaling</option>
                <option value="General">General</option>
              </select>
            </div>
            <div><Label>{t('addProduct.description')}</Label>
              <textarea className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[80px]" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.push('/dashboard/products')}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={loading} className="bg-[#005A9E] hover:bg-[#004B87]">{loading ? t('common.loading') : t('common.save')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
