"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Severity } from "@prisma/client";
import { severityLabel } from "@/lib/severity";

const SEV_COLORS: Record<Severity, string> = {
  CRITICAL: "#dc2626",
  HIGH: "#fafafa",
  MEDIUM: "#a1a1aa",
  LOW: "#71717a",
  INFO: "#52525b",
};

export function SeverityDonut({ data }: { data: Record<Severity, number> }) {
  const chartData = (Object.entries(data) as [Severity, number][])
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: severityLabel[k], severity: k, value: v }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-sm text-[color:var(--muted-foreground)]">
        No findings yet
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            animationDuration={800}
            animationEasing="ease-out"
          >
            {chartData.map((d) => (
              <Cell key={d.severity} fill={SEV_COLORS[d.severity]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as { name: string; value: number; severity: Severity };
              return (
                <div
                  style={{
                    background: "#111113",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 12,
                    color: "#fafafa",
                  }}
                >
                  <div style={{ color: SEV_COLORS[p.severity], fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: "#a1a1aa", fontSize: 11 }}>{p.value} finding{p.value === 1 ? "" : "s"}</div>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="font-serif text-3xl">{total}</div>
        <div className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)]">findings</div>
      </div>
    </div>
  );
}

export function CategoryBars({ data }: { data: Array<{ category: string; count: number }> }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-sm text-[color:var(--muted-foreground)]">
        No data
      </div>
    );
  }
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" stroke="#525252" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="category"
          stroke="#a1a1aa"
          fontSize={10}
          width={140}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: string) => (v.length > 22 ? v.slice(0, 22) + "…" : v)}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload as { category: string; count: number };
            return (
              <div
                style={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: "#fafafa",
                }}
              >
                <div style={{ fontWeight: 600 }}>{p.category}</div>
                <div style={{ color: "#a1a1aa", fontSize: 11 }}>{p.count} finding{p.count === 1 ? "" : "s"}</div>
              </div>
            );
          }}
        />
        <Bar dataKey="count" fill="#dc2626" radius={[0, 4, 4, 0]} animationDuration={800} animationEasing="ease-out" />
      </BarChart>
    </ResponsiveContainer>
  );
}
