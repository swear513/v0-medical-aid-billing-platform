import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimsTable } from "@/components/claims/claims-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ReadinessPage() {
  return (
    <AppShell>
      <AppHeader
        title="Claim Readiness"
        description="Draft claims awaiting completion and closure"
      >
        <Button asChild>
          <Link href="/claims/new">
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Link>
        </Button>
      </AppHeader>
      <main className="flex-1 p-6">
        <ClaimsTable statusFilter={["draft"]} />
      </main>
    </AppShell>
  );
}
