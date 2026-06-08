'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Factory, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LanguageSelector } from '@/components/language-selector';

export function LoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'OPERATOR' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
        if (res?.error) {
          toast.error(t('auth.invalidCredentials'));
        } else {
          router.replace('/dashboard');
        }
      } else {
        const res = await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          toast.error(data?.error || t('auth.signupFailed'));
        } else {
          const signInRes = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
          if (signInRes?.error) {
            toast.error(t('auth.accountCreated'));
            setIsLogin(true);
          } else {
            router.replace('/dashboard');
          }
        }
      }
    } catch {
      toast.error(t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004B87] via-[#005A9E] to-[#0078D4] p-4 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'https://img.freepik.com/premium-vector/abstract-modern-background-with-halftone-element-lowpoly-blue-white-gadient-color_8221-1317.jpg?w=360 fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      {/* Language selector */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-16 mb-4 rounded-xl p-2 flex items-center justify-center">
            <Image src="/MARBA2.png" alt="Marba Logo" width={160} height={48} className="object-contain" />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Factory className="h-5 w-5 text-white/80" />
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">{t('app.title')}</h1>
          </div>
          <p className="text-sm text-white/70">{t('app.subtitle')}</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl text-[#004B87]">{isLogin ? t('auth.signIn') : t('auth.signUp')}</CardTitle>
            <CardDescription>{isLogin ? t('auth.accessDashboard') : t('auth.registerNew')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  <Input id="name" placeholder={t('auth.enterName')} value={form.name} onChange={(e: any) => setForm(p => ({...p, name: e.target.value}))} required />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input id="email" type="email" placeholder="name@marba.pl" value={form.email} onChange={(e: any) => setForm(p => ({...p, email: e.target.value}))} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? 'text' : 'password'} placeholder={t('auth.enterPassword')} value={form.password} onChange={(e: any) => setForm(p => ({...p, password: e.target.value}))} required className="pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role">{t('auth.role')}</Label>
                  <select id="role" value={form.role} onChange={(e: any) => setForm(p => ({...p, role: e.target.value}))} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="OPERATOR">{t('role.operator')}</option>
                    <option value="TEAM_LEADER">{t('role.teamLeader')}</option>
                    <option value="PLANT_DIRECTOR">{t('role.plantDirector')}</option>
                  </select>
                </div>
              )}
              <Button type="submit" className="w-full bg-[#005A9E] hover:bg-[#004B87]" disabled={loading}>
                {loading ? t('auth.pleaseWait') : isLogin ? (<><LogIn className="h-4 w-4 mr-2" />{t('auth.signIn')}</>) : (<><UserPlus className="h-4 w-4 mr-2" />{t('auth.signUp')}</>)}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-[#005A9E] hover:underline">
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
