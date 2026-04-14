"use client";

import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimsTable } from "@/components/claims/claims-table";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function ValidationPage() {
  const claims = useStore((state) => state.claims);
  const validateClaim = useStore((state) => state.validateClaim);

  const readyClaims = claims.filter((c) => c.status === "ready" || c.status === "closed");
  const validatedClaims = claims.filter((c) => c.status === "validated");
  const failedClaims = claims.filter((c) => c.status === "validation_failed");

  const handleValidateAll = () => {
    readyClaims.forEach((claim) => {
      validateClaim(claim.id);
    });
  };

  return (
    <AppShell>
      <AppHeader
        title="Claim Validation"
        description="Validate claims against rules engine before submission"
      >
        {readyClaims.length > 0 && (
          <Button onClick={handleValidateAll}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Validate All ({readyClaims.length})
          </Button>
        )}
      </AppHeader>
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ready for Validation
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyClaims.length}</div>
              <p className="text-xs text-muted-foreground">Claims pending validation</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Validated
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{validatedClaims.length}</div>
              <p className="text-xs text-muted-foreground">Ready for submission</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Validation Failed
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{failedClaims.length}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Claims requiring validation */}
        <Card>
          <CardHeader>
            <CardTitle>Claims Requiring Validation</CardTitle>
            <CardDescription>
              These claims are ready to be validated against the rules engine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClaimsTable statusFilter={["ready", "closed"]} />
          </CardContent>
        </Card>

        {/* Failed validations */}
        {failedClaims.length > 0 && (
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Failed Validations
              </CardTitle>
              <CardDescription>
                These claims have validation errors that need to be resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsTable statusFilter={["validation_failed"]} />
            </CardContent>
          </Card>
        )}
      </main>
    </AppShell>
  );
}
