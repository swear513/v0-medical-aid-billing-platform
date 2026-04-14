"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { formatCurrency, formatPercentage } from "@/lib/format";
import {
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export function StatsCards() {
  const stats = useStore((state) => state.dashboardStats);

  // ✅ Fallback to prevent undefined crashes
  const safeStats = stats ?? {
    totalClaims: 0,
    totalBilled: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    validationPassRate: 0,
    rejectionRate: 0,
  };

  const cards = [
    {
      title: "Total Claims",
      value: safeStats.totalClaims.toString(),
      description: "All time claims",
      icon: FileText,
      trend: null,
    },
    {
      title: "Total Billed",
      value: formatCurrency(safeStats.totalBilled),
      description: "Cumulative billing",
      icon: DollarSign,
      trend: null,
    },
    {
      title: "Total Paid",
      value: formatCurrency(safeStats.totalPaid),
      description: "Payments received",
      icon: TrendingUp,
      trend:
        safeStats.totalBilled > 0
          ? `${((safeStats.totalPaid / safeStats.totalBilled) * 100).toFixed(0)}% of billed`
          : null,
    },
    {
      title: "Outstanding",
      value: formatCurrency(safeStats.totalOutstanding),
      description: "Pending payment",
      icon: Clock,
      trend: null,
    },
    {
      title: "Validation Rate",
      value: formatPercentage(safeStats.validationPassRate),
      description: "Pass rate",
      icon: CheckCircle,
      trend: null,
    },
    {
      title: "Rejection Rate",
      value: formatPercentage(safeStats.rejectionRate),
      description: "Scheme rejections",
      icon: AlertTriangle,
      trend: null,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.trend || card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}