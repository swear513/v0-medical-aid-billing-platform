import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimsTable } from "@/components/claims/claims-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ClaimsPage() {
  return (
    <AppShell>
      <AppHeader
        title="All Claims"
        description="View and manage all medical aid claims"
      >
        <Button asChild>
          <Link href="/claims/new">
            <Plus className="h-4 w-4 mr-2" />
            New Claim
          </Link>
        </Button>
      </AppHeader>
      <main className="flex-1 p-6">
        <ClaimsTable />
      </main>
    </AppShell>
  );
}
