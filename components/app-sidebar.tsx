"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import { RoleSwitcher } from "./role-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  CheckCircle,
  Send,
  Mail,
  Banknote,
  Scale,
  Cog,
  BookOpen,
  ScrollText,
  TestTube,
  Activity,
} from "lucide-react";
import type { UserRole } from "@/lib/types";

// Navigation items with role-based access
const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        roles: ["administrator", "billing_specialist", "healthcare_provider", "finance_officer", "compliance_auditor"] as UserRole[],
      },
    ],
  },
  {
    label: "Claims Lifecycle",
    items: [
      {
        title: "All Claims",
        href: "/claims",
        icon: FileText,
        roles: ["administrator", "billing_specialist", "healthcare_provider", "finance_officer", "compliance_auditor"] as UserRole[],
        badge: "claims",
      },
      {
        title: "Readiness",
        href: "/claims/readiness",
        icon: ClipboardList,
        roles: ["administrator", "billing_specialist", "healthcare_provider"] as UserRole[],
        badge: "draft",
      },
      {
        title: "Validation",
        href: "/claims/validation",
        icon: CheckCircle,
        roles: ["administrator", "billing_specialist"] as UserRole[],
        badge: "ready",
      },
      {
        title: "Submission",
        href: "/claims/submission",
        icon: Send,
        roles: ["administrator", "billing_specialist"] as UserRole[],
        badge: "validated",
      },
      {
        title: "Responses",
        href: "/claims/responses",
        icon: Mail,
        roles: ["administrator", "billing_specialist", "finance_officer"] as UserRole[],
        badge: "submitted",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Remittance",
        href: "/remittance",
        icon: Banknote,
        roles: ["administrator", "finance_officer", "billing_specialist"] as UserRole[],
      },
      {
        title: "Reconciliation",
        href: "/reconciliation",
        icon: Scale,
        roles: ["administrator", "finance_officer"] as UserRole[],
      },
    ],
  },
  {
    label: "Rules Engine",
    items: [
      {
        title: "Rules",
        href: "/rules",
        icon: BookOpen,
        roles: ["administrator", "billing_specialist", "compliance_auditor"] as UserRole[],
      },
      {
        title: "Decision Bundles",
        href: "/rules/bundles",
        icon: ScrollText,
        roles: ["administrator", "billing_specialist"] as UserRole[],
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Demo Scenarios",
        href: "/scenarios",
        icon: TestTube,
        roles: ["administrator", "billing_specialist", "healthcare_provider", "finance_officer", "compliance_auditor"] as UserRole[],
      },
      {
        title: "Audit Log",
        href: "/audit",
        icon: Activity,
        roles: ["administrator", "compliance_auditor"] as UserRole[],
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Cog,
        roles: ["administrator"] as UserRole[],
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const currentRole = useStore((state) => state.currentRole);
  const claims = useStore((state) => state.claims);

  // Calculate badges
  const getBadgeCount = (badge?: string): number | undefined => {
    if (!badge) return undefined;
    if (badge === "claims") return claims.length;
    if (badge === "draft") return claims.filter((c) => c.status === "draft").length;
    if (badge === "ready") return claims.filter((c) => c.status === "ready" || c.status === "closed").length;
    if (badge === "validated") return claims.filter((c) => c.status === "validated").length;
    if (badge === "submitted") return claims.filter((c) => c.status === "submitted").length;
    return undefined;
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">MediBill SA</span>
            <span className="text-xs text-muted-foreground">Medical Aid Billing</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        {navigationGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(currentRole)
          );
          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href !== "/" && pathname.startsWith(item.href));
                    const badgeCount = getBadgeCount(item.badge);
                    
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                        {badgeCount !== undefined && badgeCount > 0 && (
                          <SidebarMenuBadge>{badgeCount}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <RoleSwitcher />
      </SidebarFooter>
    </Sidebar>
  );
}
