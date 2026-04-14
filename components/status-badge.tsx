"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ClaimStatus, RuleSeverity } from "@/lib/types";

// Claim status configuration
const claimStatusConfig: Record<
  ClaimStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  draft: { label: "Draft", variant: "secondary" },
  ready: { label: "Ready", variant: "outline", className: "border-info text-info" },
  closed: { label: "Closed", variant: "outline", className: "border-primary text-primary" },
  validating: { label: "Validating", variant: "secondary", className: "animate-pulse" },
  validated: { label: "Validated", variant: "outline", className: "border-success text-success" },
  validation_failed: { label: "Validation Failed", variant: "destructive" },
  submitted: { label: "Submitted", variant: "outline", className: "border-info text-info" },
  acknowledged: { label: "Acknowledged", variant: "secondary" },
  accepted: { label: "Accepted", variant: "outline", className: "border-success text-success" },
  rejected: { label: "Rejected", variant: "destructive" },
  partial: { label: "Partial Payment", variant: "outline", className: "border-warning text-warning" },
  paid: { label: "Paid", variant: "outline", className: "border-success text-success" },
  reconciled: { label: "Reconciled", variant: "default", className: "bg-success text-success-foreground" },
  appealed: { label: "Appealed", variant: "outline", className: "border-warning text-warning" },
  written_off: { label: "Written Off", variant: "secondary", className: "line-through" },
};

interface ClaimStatusBadgeProps {
  status: ClaimStatus;
  className?: string;
}

export function ClaimStatusBadge({ status, className }: ClaimStatusBadgeProps) {
  const config = claimStatusConfig[status];
  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

// Severity configuration
const severityConfig: Record<
  RuleSeverity,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  error: { label: "Error", variant: "destructive" },
  warning: { label: "Warning", variant: "outline", className: "border-warning text-warning" },
  info: { label: "Info", variant: "outline", className: "border-info text-info" },
};

interface SeverityBadgeProps {
  severity: RuleSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

// Reconciliation status
type ReconciliationStatus = "matched" | "partial_match" | "unmatched" | "disputed";

const reconciliationStatusConfig: Record<
  ReconciliationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }
> = {
  matched: { label: "Matched", variant: "outline", className: "border-success text-success" },
  partial_match: { label: "Partial Match", variant: "outline", className: "border-warning text-warning" },
  unmatched: { label: "Unmatched", variant: "destructive" },
  disputed: { label: "Disputed", variant: "outline", className: "border-destructive text-destructive" },
};

interface ReconciliationStatusBadgeProps {
  status: ReconciliationStatus;
  className?: string;
}

export function ReconciliationStatusBadge({ status, className }: ReconciliationStatusBadgeProps) {
  const config = reconciliationStatusConfig[status];
  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
