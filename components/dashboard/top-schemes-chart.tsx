"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TopSchemesChart() {
  const claims = useStore((state) => state.claims);
  const schemes = useStore((state) => state.schemes);

  // Calculate billing by scheme
  const schemeData = schemes.map((scheme) => {
    const schemeClaims = claims.filter((c) => c.schemeId === scheme.id);
    const totalBilled = schemeClaims.reduce((sum, c) => sum + c.totalBilled, 0);
    const totalPaid = schemeClaims.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
    return {
      id: scheme.id,
      name: scheme.name,
      totalBilled,
      totalPaid,
      claimCount: schemeClaims.length,
    };
  }).filter((s) => s.totalBilled > 0)
    .sort((a, b) => b.totalBilled - a.totalBilled)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing by Scheme</CardTitle>
        <CardDescription>Top medical schemes by billing volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {schemeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemeData}
                  dataKey="totalBilled"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {schemeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No billing data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
