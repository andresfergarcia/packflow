'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/ui/animate';
import { Bot, Camera, Send, Lightbulb, Wrench, CheckCircle, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n/i18n-context';

const PREDEFINED_DIAGNOSTICS: Record<string, { problem: string; causes: string[]; steps: string[]; urgency: string }> = {
  'film-jam': {
    problem: 'Film Feed Mechanism Jam',
    causes: ['Film roll misalignment', 'Worn feed rollers', 'Static buildup on film', 'Incorrect film tension settings'],
    steps: ['1. Emergency stop the machine', '2. Check film roll alignment and reseat if necessary', '3. Inspect feed rollers for wear or debris', '4. Clean rollers with anti-static spray', '5. Adjust film tension to 2.5-3.0 N/cm', '6. Run test cycle at reduced speed (50%)', '7. If persists, replace feed rollers (Part #BT-FR-28)'],
    urgency: 'HIGH',
  },
  'glue-temp': {
    problem: 'Glue Temperature Out of Range',
    causes: ['Heating element degradation', 'Thermocouple sensor drift', 'Ambient temperature change', 'Glue viscosity change due to new batch'],
    steps: ['1. Check current temperature reading vs. setpoint', '2. Allow 5 min stabilization time', '3. Verify thermocouple connection (clean contacts)', '4. Calibrate sensor using reference thermometer', '5. If element is degraded, replace heater cartridge (Part #GL-HC-165)', '6. Adjust setpoint \u00b15\u00b0C if using new glue batch'],
    urgency: 'MEDIUM',
  },
  'vibration': {
    problem: 'Abnormal Machine Vibration',
    causes: ['Unbalanced press tooling', 'Worn bearings', 'Loose mounting bolts', 'Foreign object in mechanism'],
    steps: ['1. Reduce speed to 50% immediately', '2. Listen for bearing noise (high-pitched whine)', '3. Check all mounting bolts (torque: 45 Nm)', '4. Inspect press tooling for chips or cracks', '5. Run vibration analysis if available', '6. If bearings suspected, schedule replacement within 24h', '7. Do NOT run at full speed until diagnosed'],
    urgency: 'CRITICAL',
  },
  'print-quality': {
    problem: 'Print Quality Degradation',
    causes: ['Clogged ink nozzle', 'Low ink level', 'Print head misalignment', 'Incorrect print speed for line speed'],
    steps: ['1. Pause printing and inspect last 5 prints', '2. Run automatic head cleaning cycle (3x)', '3. Check ink level (replace if <20%)', '4. Verify print head alignment using test pattern', '5. Confirm print speed matches line speed', '6. If nozzle is clogged, soak head in cleaning solution for 15 min', '7. Replace cartridge if issue persists (Hitachi JP-K72)'],
    urgency: 'LOW',
  },
};

export function AIAssistantContent() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { t } = useI18n();

  const diagnostic = selectedIssue ? PREDEFINED_DIAGNOSTICS[selectedIssue] ?? null : null;

  const handlePhotoSimulation = () => {
    setIsAnalyzing(true);
    setChatHistory(prev => [...prev, { role: 'user', content: t('ai.photoUploaded') }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: 'assistant', content: t('ai.imageAnalysis') }]);
      setSelectedIssue('film-jam');
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleSend = () => {
    if (!userMessage?.trim?.()) return;
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    const msg = userMessage?.toLowerCase?.() ?? '';
    setUserMessage('');
    setIsAnalyzing(true);
    setTimeout(() => {
      let response = 'I understand your concern. Based on the symptoms you described, ';
      let issue = null;
      if (msg?.includes?.('film') || msg?.includes?.('jam') || msg?.includes?.('stuck') || msg?.includes?.('folia') || msg?.includes?.('atasco')) {
        response += 'this sounds like a film feed mechanism issue. Let me pull up the diagnostic guide.';
        issue = 'film-jam';
      } else if (msg?.includes?.('glue') || msg?.includes?.('temperature') || msg?.includes?.('hot') || msg?.includes?.('klej') || msg?.includes?.('pegamento')) {
        response += 'this appears to be a glue temperature regulation problem. Here are the recommended steps.';
        issue = 'glue-temp';
      } else if (msg?.includes?.('vibrat') || msg?.includes?.('shak') || msg?.includes?.('noise') || msg?.includes?.('wibracja') || msg?.includes?.('vibraci')) {
        response += 'abnormal vibration can indicate several issues. Let me guide you through diagnosis.';
        issue = 'vibration';
      } else if (msg?.includes?.('print') || msg?.includes?.('ink') || msg?.includes?.('code') || msg?.includes?.('druk') || msg?.includes?.('tinta')) {
        response += 'print quality issues are common and usually easy to resolve. Here\'s what to check.';
        issue = 'print-quality';
      } else {
        response += 'I recommend checking the machine manual for this specific issue. You can also try describing the symptoms in more detail (e.g., mention film, glue, vibration, or print issues).';
      }
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
      if (issue) setSelectedIssue(issue);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <FadeIn>
        <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 text-[#004B87] dark:text-blue-300">
          <Bot className="h-6 w-6 text-[#005A9E]" />{t('ai.title')}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('ai.desc')}</p>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[500px] border-0 shadow-md">
          <CardHeader className="pb-2 border-b">
            <CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><Bot className="h-4 w-4 text-[#005A9E]" />{t('ai.chatTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-blue-50 dark:bg-muted rounded-lg p-3 text-xs">
              <p className="font-medium text-[#004B87] dark:text-blue-300">{t('ai.assistant')}</p>
              <p className="text-muted-foreground mt-1">{t('ai.greeting')}</p>
              <ul className="list-disc ml-4 mt-1 text-muted-foreground">
                <li>{t('ai.option1')}</li>
                <li>{t('ai.option2')}</li>
                <li>{t('ai.option3')}</li>
              </ul>
            </div>
            {chatHistory?.map?.((msg: any, i: number) => (
              <div key={i} className={`rounded-lg p-3 text-xs ${msg?.role === 'user' ? 'bg-[#005A9E]/10 ml-8' : 'bg-blue-50 dark:bg-muted mr-8'}`}>
                <p className="font-medium">{msg?.role === 'user' ? t('ai.you') : t('ai.assistant')}</p>
                <p className="text-muted-foreground mt-1">{msg?.content ?? ''}</p>
              </div>
            )) ?? null}
            {isAnalyzing && (
              <div className="bg-blue-50 dark:bg-muted rounded-lg p-3 text-xs animate-pulse">
                <p className="font-medium">{t('ai.assistant')}</p>
                <p className="text-muted-foreground mt-1">{t('ai.analyzing')}</p>
              </div>
            )}
          </CardContent>
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePhotoSimulation} disabled={isAnalyzing}>
                <Camera className="h-4 w-4 mr-1" />{t('ai.photo')}
              </Button>
              <input
                value={userMessage}
                onChange={(e: any) => setUserMessage(e?.target?.value ?? '')}
                onKeyDown={(e: any) => e?.key === 'Enter' && handleSend()}
                placeholder={t('ai.describePlaceholder')}
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <Button size="sm" onClick={handleSend} disabled={isAnalyzing || !userMessage?.trim?.()} className="bg-[#005A9E] hover:bg-[#004B87]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {Object.keys(PREDEFINED_DIAGNOSTICS).map((key: string) => (
                <Button key={key} variant="ghost" size="sm" className="text-[10px] h-6 px-2" onClick={() => { setSelectedIssue(key); setChatHistory(prev => [...prev, { role: 'user', content: `Diagnose: ${PREDEFINED_DIAGNOSTICS[key]?.problem ?? key}` }, { role: 'assistant', content: `I've identified this as a ${PREDEFINED_DIAGNOSTICS[key]?.problem ?? 'machine issue'}. See the diagnostic panel for detailed steps.` }]); }}>
                  {PREDEFINED_DIAGNOSTICS[key]?.problem ?? key}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className={`h-[500px] overflow-y-auto border-0 shadow-md ${diagnostic ? '' : 'flex items-center justify-center'}`}>
          {diagnostic ? (
            <>
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2 text-[#004B87] dark:text-blue-300"><Lightbulb className="h-4 w-4 text-amber-500" />{t('ai.diagnosticReport')}</CardTitle>
                  <Badge variant={diagnostic.urgency === 'CRITICAL' ? 'destructive' : diagnostic.urgency === 'HIGH' ? 'default' : 'secondary'} className="text-[10px]">
                    {diagnostic.urgency} {t('ai.urgency')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-500" />{t('ai.problemIdentified')}</h3>
                  <p className="text-sm mt-1">{diagnostic.problem}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2">{t('ai.possibleCauses')}</h3>
                  <ul className="space-y-1">
                    {diagnostic.causes?.map?.((c: string, i: number) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#005A9E] shrink-0" />{c}
                      </li>
                    )) ?? null}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2"><Wrench className="h-4 w-4 text-[#005A9E]" />{t('ai.recommendedSteps')}</h3>
                  <div className="space-y-2">
                    {diagnostic.steps?.map?.((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 text-xs p-2 rounded bg-blue-50 dark:bg-muted/50">
                        <CheckCircle className="h-3.5 w-3.5 text-[#005A9E] shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </div>
                    )) ?? null}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="text-center text-muted-foreground p-8">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t('ai.describeForDiag')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
