"use client";

import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimsTable } from "@/components/claims/claims-table";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, CheckCircle, Clock } from "lucide-react";

export default function SubmissionPage() {
  const claims = useStore((state) => state.claims);
  const submitClaim = useStore((state) => state.submitClaim);

  const validatedClaims = claims.filter((c) => c.status === "validated");
  const submittedClaims = claims.filter((c) => c.status === "submitted");

  const handleSubmitAll = () => {
    validatedClaims.forEach((claim) => {
      submitClaim(claim.id);
    });
  };

  return (
    <AppShell>
      <AppHeader
        title="Claim Submission"
        description="Submit validated claims to medical schemes"
      >
        {validatedClaims.length > 0 && (
          <Button onClick={handleSubmitAll}>
            <Send className="h-4 w-4 mr-2" />
            Submit All ({validatedClaims.length})
          </Button>
        )}
      </AppHeader>
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ready for Submission
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{validatedClaims.length}</div>
              <p className="text-xs text-muted-foreground">Validated and ready to send</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Recently Submitted
              </CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedClaims.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting scheme response</p>
            </CardContent>
          </Card>
        </div>

        {/* Validated claims ready for submission */}
        <Card>
          <CardHeader>
            <CardTitle>Ready for Submission</CardTitle>
            <CardDescription>
              These claims have passed validation and can be submitted to medical schemes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClaimsTable statusFilter={["validated"]} />
          </CardContent>
        </Card>

        {/* Recently submitted */}
        {submittedClaims.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Submitted</CardTitle>
              <CardDescription>
                Claims submitted to schemes, awaiting acknowledgment or response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsTable statusFilter={["submitted", "acknowledged"]} />
            </CardContent>
          </Card>
        )}
      </main>
    </AppShell>
  );
}
