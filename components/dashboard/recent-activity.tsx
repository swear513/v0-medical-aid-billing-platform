"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/lib/store";
import { formatRelativeTime } from "@/lib/format";
import {
  FileText,
  CheckCircle,
  Send,
  Mail,
  DollarSign,
  Scale,
  AlertTriangle,
  User,
  Cog,
} from "lucide-react";
import type { AuditAction } from "@/lib/types";

const actionConfig: Record<AuditAction, { icon: React.ElementType; color: string }> = {
  claim_created: { icon: FileText, color: "text-info" },
  claim_updated: { icon: FileText, color: "text-muted-foreground" },
  claim_closed: { icon: CheckCircle, color: "text-primary" },
  validation_run: { icon: CheckCircle, color: "text-success" },
  claim_submitted: { icon: Send, color: "text-info" },
  response_received: { icon: Mail, color: "text-warning" },
  payment_posted: { icon: DollarSign, color: "text-success" },
  reconciliation_completed: { icon: Scale, color: "text-chart-1" },
  rule_executed: { icon: AlertTriangle, color: "text-warning" },
  user_action: { icon: User, color: "text-muted-foreground" },
};

export function RecentActivity() {
  const auditLogs = useStore((state) => state.auditLogs);
  const recentLogs = auditLogs.slice(0, 10);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </div>
        <Link
          href="/audit"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {recentLogs.map((log) => {
              const config = actionConfig[log.action] || { icon: Cog, color: "text-muted-foreground" };
              const Icon = config.icon;
              
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm leading-snug">{log.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(log.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            {recentLogs.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
