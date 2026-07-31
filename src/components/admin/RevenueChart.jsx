import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatINR } from '../../lib/calculatePrice';

export function RevenueChart({ data }) {
  return (
    <div className="glass-card p-5">
      <div className="font-body text-[11px] uppercase tracking-wide text-ivory/40">Quoted Value — Last 6 Months</div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis
              stroke="rgba(255,255,255,0.4)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 100000 ? `${v / 100000}L` : v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              contentStyle={{ background: '#141414', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8 }}
              labelStyle={{ color: '#D4AF37' }}
              formatter={(value) => [formatINR(value), 'Quoted Value']}
            />
            <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
