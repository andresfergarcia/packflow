'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function ShiftAnalysisChart({ logs }: { logs: any[] }) {
  const shiftData: Record<string, { produced: number; count: number }> = { MORNING: { produced: 0, count: 0 }, AFTERNOON: { produced: 0, count: 0 }, NIGHT: { produced: 0, count: 0 } };
  (logs ?? []).forEach((log: any) => {
    const shift = log?.shift ?? 'MORNING';
    if (shiftData[shift]) {
      shiftData[shift].produced += log?.produced ?? 0;
      shiftData[shift].count += 1;
    }
  });
  const data = Object.entries(shiftData ?? {}).map(([shift, val]: [string, any]) => ({
    shift,
    avgProduced: val?.count > 0 ? Math.round((val?.produced ?? 0) / (val?.count ?? 1)) : 0,
    totalProduced: val?.produced ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
        <XAxis dataKey="shift" tickLine={false} tick={{ fontSize: 10 }} />
        <YAxis tickLine={false} tick={{ fontSize: 10 }} />
        <Tooltip contentStyle={{ fontSize: 11 }} />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="avgProduced" name="Avg Produced" fill="#60B5FF" radius={[4, 4, 0, 0]} />
        <Bar dataKey="totalProduced" name="Total" fill="#80D8C3" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
