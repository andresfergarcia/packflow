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
import { Settings2, Save, Boxes } from 'lucide-react';

export function MachineConfigContent() {
  const { t } = useI18n();
  const { data: machines } = useFetch('/api/machines', []);
  const { data: products } = useFetch('/api/products', []);
  const { data: cards, refetch } = useFetch<any[]>('/api/product-cards', []);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [form, setForm] = useState({ dimensions: '', nozzleType: '', nozzleSize: '', glueAmount: '', glueTemp: '', printerPos: '', printerSpeed: '', filmType: '', boxType: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const loadExisting = (machId: string, prodId: string) => {
    const existing = cards.find((c: any) => c.machineId === machId && c.productId === prodId);
    if (existing) {
      setForm({ dimensions: existing.dimensions || '', nozzleType: existing.nozzleType || '', nozzleSize: existing.nozzleSize || '', glueAmount: existing.glueAmount?.toString() || '', glueTemp: existing.glueTemp?.toString() || '', printerPos: existing.printerPos || '', printerSpeed: existing.printerSpeed?.toString() || '', filmType: existing.filmType || '', boxType: existing.boxType || '', notes: existing.notes || '' });
    } else {
      setForm({ dimensions: '', nozzleType: '', nozzleSize: '', glueAmount: '', glueTemp: '', printerPos: '', printerSpeed: '', filmType: '', boxType: '', notes: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine || !selectedProduct) { toast.error(t('machineConfig.selectBoth')); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/product-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, machineId: selectedMachine, productId: selectedProduct }),
      });
      if (!res.ok) throw new Error();
      toast.success(t('machineConfig.saved'));
      refetch();
    } catch { toast.error(t('common.error')); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#004B87] dark:text-blue-300 flex items-center gap-2">
          <Settings2 className="h-6 w-6" /> {t('machineConfig.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('machineConfig.subtitle')}</p>
      </div>

      {/* Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>{t('machineConfig.selectMachine')}</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={selectedMachine} onChange={e => { setSelectedMachine(e.target.value); if (selectedProduct) loadExisting(e.target.value, selectedProduct); }}>
                <option value="">{t('common.select')}</option>
                {machines.map((m: any) => <option key={m.id} value={m.id}>{m.name} ({m.type})</option>)}
              </select>
            </div>
            <div><Label>{t('machineConfig.selectProduct')}</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={selectedProduct} onChange={e => { setSelectedProduct(e.target.value); if (selectedMachine) loadExisting(selectedMachine, e.target.value); }}>
                <option value="">{t('common.select')}</option>
                {products.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Config Form */}
      {selectedMachine && selectedProduct && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Boxes className="h-5 w-5" /> {t('machineConfig.parameters')}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label>{t('machineConfig.dimensions')}</Label>
                <Input value={form.dimensions} onChange={e => setForm({...form, dimensions: e.target.value})} placeholder="120x80x45mm" />
              </div>
              <div><Label>{t('machineConfig.nozzleType')}</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-background" value={form.nozzleType} onChange={e => setForm({...form, nozzleType: e.target.value})}>
                  <option value="">{t('common.select')}</option>
                  {['Type A','Type B','Type C','Type D','Type E'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div><Label>{t('machineConfig.nozzleSize')}</Label>
                <Input value={form.nozzleSize} onChange={e => setForm({...form, nozzleSize: e.target.value})} placeholder="12mm" />
              </div>
              <div><Label>{t('machineConfig.glueAmount')} (ml)</Label>
                <Input type="number" step="0.1" value={form.glueAmount} onChange={e => setForm({...form, glueAmount: e.target.value})} />
              </div>
              <div><Label>{t('machineConfig.glueTemp')} (°C)</Label>
                <Input type="number" value={form.glueTemp} onChange={e => setForm({...form, glueTemp: e.target.value})} />
              </div>
              <div><Label>{t('machineConfig.printerPos')}</Label>
                <Input value={form.printerPos} onChange={e => setForm({...form, printerPos: e.target.value})} placeholder="Position 3" />
              </div>
              <div><Label>{t('machineConfig.printerSpeed')}</Label>
                <Input type="number" step="0.1" value={form.printerSpeed} onChange={e => setForm({...form, printerSpeed: e.target.value})} />
              </div>
              <div><Label>{t('machineConfig.filmType')}</Label>
                <Input value={form.filmType} onChange={e => setForm({...form, filmType: e.target.value})} placeholder="PE 30μm" />
              </div>
              <div><Label>{t('machineConfig.boxType')}</Label>
                <Input value={form.boxType} onChange={e => setForm({...form, boxType: e.target.value})} placeholder="Cardboard E-flute" />
              </div>
              <div className="md:col-span-3"><Label>{t('machineConfig.notes')}</Label>
                <textarea className="w-full border rounded-md px-3 py-2 text-sm bg-background min-h-[60px]" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <Button type="submit" disabled={saving} className="bg-[#005A9E] hover:bg-[#004B87]">
                  <Save className="h-4 w-4 mr-2" /> {saving ? t('common.loading') : t('common.save')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Configs */}
      <div>
        <h2 className="font-semibold text-lg text-[#004B87] dark:text-blue-300 mb-3">{t('machineConfig.existingConfigs')}</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c: any) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{c.product?.name}</span>
                  <Badge variant="secondary" className="text-xs">{c.machine?.name}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  {c.nozzleType && <span>🔧 {c.nozzleType} {c.nozzleSize}</span>}
                  {c.glueTemp && <span>🌡️ {c.glueTemp}°C</span>}
                  {c.filmType && <span>📦 {c.filmType}</span>}
                  {c.dimensions && <span>📐 {c.dimensions}</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
