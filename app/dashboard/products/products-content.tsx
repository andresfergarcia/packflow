'use client';

import { useState } from 'react';
import { useFetch } from '@/hooks/use-fetch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Boxes, Search, Ruler, Droplets, Thermometer, Printer, Package, Tag } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

export function ProductsContent() {
  const { data: products, loading } = useFetch<any[]>('/api/products', []);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { t } = useI18n();

  const filtered = products?.filter?.((p: any) => 
    p?.name?.toLowerCase?.()?.includes?.(search?.toLowerCase?.() ?? '') ||
    p?.sku?.toLowerCase?.()?.includes?.(search?.toLowerCase?.() ?? '') ||
    p?.category?.toLowerCase?.()?.includes?.(search?.toLowerCase?.() ?? '')
  ) ?? [];

  if (loading) return <div className="space-y-4">{[1,2,3].map((i: number) => <Skeleton key={i} className="h-32 rounded-lg" />)}</div>;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
              <Boxes className="h-6 w-6 text-[#005A9E]" />{t('products.title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t('products.desc')}</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('products.searchPlaceholder')} value={search} onChange={(e: any) => setSearch(e?.target?.value ?? '')} className="pl-9" />
          </div>
        </div>
      </FadeIn>

      {selectedProduct ? (
        <FadeIn>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#004B87] dark:text-blue-300">{selectedProduct?.name ?? 'Product'}</CardTitle>
                <button onClick={() => setSelectedProduct(null)} className="text-sm text-[#005A9E] hover:underline">{t('common.back')}</button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2"><Tag className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">SKU</p><p className="text-sm font-mono font-medium">{selectedProduct?.sku ?? 'N/A'}</p></div></div>
                <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">EAN</p><p className="text-sm font-mono font-medium">{selectedProduct?.ean ?? 'N/A'}</p></div></div>
                <div><p className="text-xs text-muted-foreground">{t('incidents.category')}</p><Badge variant="secondary">{selectedProduct?.category ?? 'N/A'}</Badge></div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{selectedProduct?.description ?? ''}</p>
              <h3 className="text-sm font-semibold mb-3 text-[#004B87] dark:text-blue-300">{t('products.machineConfigs')}</h3>
              <div className="grid gap-3">
                {selectedProduct?.productCards?.map?.((card: any) => (
                  <Card key={card?.id} className="bg-slate-50 dark:bg-muted/50 border-0">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold mb-3">{card?.machine?.name ?? 'Machine'}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="flex items-center gap-1.5"><Ruler className="h-3.5 w-3.5 text-[#005A9E]" /><div><p className="text-muted-foreground">{t('products.dimensions')}</p><p className="font-medium">{card?.dimensions ?? 'N/A'}</p></div></div>
                        <div className="flex items-center gap-1.5"><Droplets className="h-3.5 w-3.5 text-[#005A9E]" /><div><p className="text-muted-foreground">{t('products.glue')}</p><p className="font-medium">{card?.glueAmount ?? 0}g</p></div></div>
                        <div className="flex items-center gap-1.5"><Thermometer className="h-3.5 w-3.5 text-[#005A9E]" /><div><p className="text-muted-foreground">{t('products.glueTemp')}</p><p className="font-medium">{card?.glueTemp ?? 0}°C</p></div></div>
                        <div className="flex items-center gap-1.5"><Printer className="h-3.5 w-3.5 text-[#005A9E]" /><div><p className="text-muted-foreground">{t('products.printer')}</p><p className="font-medium">{card?.printerPos ?? 'N/A'}</p></div></div>
                        <div><p className="text-muted-foreground">{t('products.nozzle')}</p><p className="font-medium">{card?.nozzleType ?? 'N/A'} - {card?.nozzleSize ?? 'N/A'}</p></div>
                        <div><p className="text-muted-foreground">{t('products.filmType')}</p><p className="font-medium">{card?.filmType ?? 'N/A'}</p></div>
                        <div><p className="text-muted-foreground">{t('products.boxType')}</p><p className="font-medium">{card?.boxType ?? 'N/A'}</p></div>
                        <div><p className="text-muted-foreground">{t('products.printSpeed')}</p><p className="font-medium">{card?.printerSpeed ?? 0} m/s</p></div>
                      </div>
                    </CardContent>
                  </Card>
                )) ?? <p className="text-sm text-muted-foreground">{t('products.noConfigs')}</p>}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <Stagger staggerDelay={0.04}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered?.map?.((product: any) => (
              <StaggerItem key={product?.id}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-0 shadow-sm bg-white dark:bg-card" onClick={() => setSelectedProduct(product)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold truncate">{product?.name ?? 'Product'}</h3>
                        <p className="text-xs font-mono text-muted-foreground">{product?.sku ?? ''}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">{product?.category ?? 'N/A'}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product?.description ?? ''}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Boxes className="h-3 w-3" />
                      <span>{product?.productCards?.length ?? 0} {(product?.productCards?.length ?? 0) !== 1 ? t('products.configs') : t('products.config')}</span>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )) ?? null}
          </div>
        </Stagger>
      )}
    </div>
  );
}
