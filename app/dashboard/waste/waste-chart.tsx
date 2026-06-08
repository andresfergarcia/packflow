'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function WasteChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data ?? {}).map(([name, value]: [string, any]) => ({ name, value: Number(value ?? 0) }));

  if (!chartData?.length) return <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No data</div>;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
        <XAxis dataKey="name" tickLine={false} tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} interval={0} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Bar dataKey="value" fill="#00A3E0" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
