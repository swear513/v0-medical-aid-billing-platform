"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const statusLabels: Record<string, string> = {
  draft: "Draft",
  ready: "Ready",
  closed: "Closed",
  validating: "Validating",
  validated: "Validated",
  validation_failed: "Val. Failed",
  submitted: "Submitted",
  acknowledged: "Acknowledged",
  accepted: "Accepted",
  rejected: "Rejected",
  partial: "Partial",
  paid: "Paid",
  reconciled: "Reconciled",
  appealed: "Appealed",
  written_off: "Written Off",
};

const statusColors: Record<string, string> = {
  draft: "var(--muted-foreground)",
  ready: "var(--info)",
  closed: "var(--primary)",
  validating: "var(--info)",
  validated: "var(--success)",
  validation_failed: "var(--destructive)",
  submitted: "var(--info)",
  acknowledged: "var(--muted-foreground)",
  accepted: "var(--success)",
  rejected: "var(--destructive)",
  partial: "var(--warning)",
  paid: "var(--success)",
  reconciled: "var(--chart-1)",
  appealed: "var(--warning)",
  written_off: "var(--muted-foreground)",
};

export function ClaimsByStatusChart() {
  const stats = useStore((state) => state.getDashboardStats());

  const data = Object.entries(stats.claimsByStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      status,
      label: statusLabels[status] || status,
      count,
      color: statusColors[status] || "var(--primary)",
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Claims by Status</CardTitle>
        <CardDescription>Distribution of claims across workflow stages</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "var(--foreground)" }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
