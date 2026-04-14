"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  CheckCircle,
  Send,
  Mail,
  DollarSign,
  Scale,
  ChevronRight,
} from "lucide-react";

const pipelineStages = [
  {
    id: "readiness",
    label: "Readiness",
    icon: ClipboardList,
    statuses: ["draft"],
    href: "/claims/readiness",
    description: "New claims awaiting completion",
  },
  {
    id: "validation",
    label: "Validation",
    icon: CheckCircle,
    statuses: ["ready", "closed", "validating"],
    href: "/claims/validation",
    description: "Ready for rule validation",
  },
  {
    id: "submission",
    label: "Submission",
    icon: Send,
    statuses: ["validated"],
    href: "/claims/submission",
    description: "Validated, awaiting submission",
  },
  {
    id: "response",
    label: "Response",
    icon: Mail,
    statuses: ["submitted", "acknowledged"],
    href: "/claims/responses",
    description: "Submitted to schemes",
  },
  {
    id: "payment",
    label: "Payment",
    icon: DollarSign,
    statuses: ["accepted", "rejected", "partial", "paid", "appealed"],
    href: "/remittance",
    description: "Processed by schemes",
  },
  {
    id: "reconciliation",
    label: "Reconciliation",
    icon: Scale,
    statuses: ["reconciled"],
    href: "/reconciliation",
    description: "Fully reconciled",
  },
];

export function ClaimsPipeline() {
  const claims = useStore((state) => state.claims);

  const getStageCount = (statuses: string[]) =>
    claims.filter((c) => statuses.includes(c.status)).length;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Claims Pipeline</CardTitle>
        <CardDescription>
          Track claims through the complete billing lifecycle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
          {pipelineStages.map((stage, index) => {
            const count = getStageCount(stage.statuses);
            const Icon = stage.icon;

            return (
              <div key={stage.id} className="flex items-center">
                <Link
                  href={stage.href}
                  className={cn(
                    "flex flex-col items-center justify-center min-w-[140px] p-4 rounded-lg border transition-colors",
                    "hover:bg-accent hover:border-primary/50",
                    count > 0 ? "border-primary/30 bg-primary/5" : "border-border"
                  )}
                >
                  <Icon className={cn("h-6 w-6 mb-2", count > 0 ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground text-center mt-1">
                    {stage.description}
                  </span>
                </Link>
                {index < pipelineStages.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground mx-1 shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
