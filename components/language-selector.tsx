'use client';

import { useI18n } from '@/lib/i18n/i18n-context';
import { LOCALE_NAMES, LOCALE_FLAGS, Locale } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const locales: Locale[] = ['en', 'pl', 'es'];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors ${
          compact ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'
        }`}
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        {!compact && <span className="font-medium">{LOCALE_NAMES[locale]}</span>}
        <Globe className={compact ? 'h-3 w-3 text-muted-foreground' : 'h-3.5 w-3.5 text-muted-foreground'} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg overflow-hidden min-w-[140px]">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                locale === l ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
              }`}
            >
              <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_NAMES[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
