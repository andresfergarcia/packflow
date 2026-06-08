'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function MachineComparisonChart({ machines }: { machines: any[] }) {
  const data = (machines ?? []).map((m: any) => ({
    name: m?.name ?? '',
    produced: m?.dailyProduced ?? 0,
    target: m?.dailyTarget ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 50 }}>
        <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} interval={0} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="produced" name="Produced" fill="#00A3E0" radius={[4, 4, 0, 0]} />
        <Bar dataKey="target" name="Target" fill="#FF9149" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
