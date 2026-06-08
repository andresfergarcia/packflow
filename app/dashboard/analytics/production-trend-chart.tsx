'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function ProductionTrendChart({ logs }: { logs: any[] }) {
  const dateMap: Record<string, number> = {};
  (logs ?? []).forEach((log: any) => {
    const d = new Date(log?.date ?? Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    dateMap[d] = (dateMap[d] ?? 0) + (log?.produced ?? 0);
  });
  const data = Object.entries(dateMap ?? {}).map(([date, produced]: [string, any]) => ({ date, produced: Number(produced ?? 0) })).reverse();

  if (!data?.length) return <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
        <XAxis dataKey="date" tickLine={false} tick={{ fontSize: 10 }} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="produced" name="Total Produced" stroke="#00A3E0" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
