'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export default function OEEChart({ machines }: { machines: any[] }) {
  const data = (machines ?? []).map((m: any) => ({
    name: m?.name ?? '',
    oee: m?.oee ?? 0,
    uptime: m?.uptime ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
        <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <ReferenceLine y={85} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Target 85%', position: 'right', style: { fontSize: 10, fill: '#10b981' } }} />
        <Bar dataKey="oee" name="OEE" fill="#00A3E0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
