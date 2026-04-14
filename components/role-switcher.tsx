"use client";

import { useStore } from "@/lib/store";
import type { UserRole } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  FileText,
  Stethoscope,
  DollarSign,
  ClipboardCheck,
} from "lucide-react";

const roleConfig: Record<
  UserRole,
  { label: string; description: string; icon: React.ElementType }
> = {
  administrator: {
    label: "Administrator",
    description: "Full system access",
    icon: Shield,
  },
  billing_specialist: {
    label: "Billing Specialist",
    description: "Claims & validation",
    icon: FileText,
  },
  healthcare_provider: {
    label: "Healthcare Provider",
    description: "Create & view claims",
    icon: Stethoscope,
  },
  finance_officer: {
    label: "Finance Officer",
    description: "Payments & reconciliation",
    icon: DollarSign,
  },
  compliance_auditor: {
    label: "Compliance Auditor",
    description: "Audit & review",
    icon: ClipboardCheck,
  },
};

export function RoleSwitcher() {
  const currentRole = useStore((state) => state.currentRole);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentRole = useStore((state) => state.setCurrentRole);

  const currentConfig = roleConfig[currentRole];
  const Icon = currentConfig.icon;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground px-1">
        Demo Role
      </span>
      <Select value={currentRole} onValueChange={(v) => setCurrentRole(v as UserRole)}>
        <SelectTrigger className="w-full bg-sidebar-accent/50 border-sidebar-border">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-medium">{currentConfig.label}</span>
              </div>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(roleConfig) as UserRole[]).map((role) => {
            const config = roleConfig[role];
            const RoleIcon = config.icon;
            return (
              <SelectItem key={role} value={role}>
                <div className="flex items-center gap-2">
                  <RoleIcon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {config.description}
                    </span>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {currentUser && (
        <p className="text-xs text-muted-foreground px-1">
          Logged in as {currentUser.firstName} {currentUser.lastName}
        </p>
      )}
    </div>
  );
}
