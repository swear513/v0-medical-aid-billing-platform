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

  const cards = [
    {
      title: "Total Claims",
      value: stats.totalClaims.toString(),
      description: "All time claims",
      icon: FileText,
      trend: null,
    },
    {
      title: "Total Billed",
      value: formatCurrency(stats.totalBilled),
      description: "Cumulative billing",
      icon: DollarSign,
      trend: null,
    },
    {
      title: "Total Paid",
      value: formatCurrency(stats.totalPaid),
      description: "Payments received",
      icon: TrendingUp,
      trend: stats.totalBilled > 0
        ? `${((stats.totalPaid / stats.totalBilled) * 100).toFixed(0)}% of billed`
        : null,
    },
    {
      title: "Outstanding",
      value: formatCurrency(stats.totalOutstanding),
      description: "Pending payment",
      icon: Clock,
      trend: null,
    },
    {
      title: "Validation Rate",
      value: formatPercentage(stats.validationPassRate),
      description: "Pass rate",
      icon: CheckCircle,
      trend: null,
    },
    {
      title: "Rejection Rate",
      value: formatPercentage(stats.rejectionRate),
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
