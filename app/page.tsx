import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ClaimsPipeline } from "@/components/dashboard/claims-pipeline";
import { ClaimsByStatusChart } from "@/components/dashboard/claims-by-status-chart";
import { TopSchemesChart } from "@/components/dashboard/top-schemes-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <AppShell>
      <AppHeader
        title="Dashboard"
        description="Overview of your medical aid billing operations"
      />
      <main className="flex-1 p-6 space-y-6">
        <StatsCards />
        <ClaimsPipeline />
        <div className="grid gap-6 lg:grid-cols-3">
          <ClaimsByStatusChart />
          <TopSchemesChart />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <RecentActivity />
        </div>
      </main>
    </AppShell>
  );
}
