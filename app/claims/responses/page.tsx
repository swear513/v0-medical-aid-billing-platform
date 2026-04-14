"use client";

import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimsTable } from "@/components/claims/claims-table";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

export default function ResponsesPage() {
  const claims = useStore((state) => state.claims);

  const submittedClaims = claims.filter((c) => c.status === "submitted" || c.status === "acknowledged");
  const acceptedClaims = claims.filter((c) => c.status === "accepted" || c.status === "paid");
  const rejectedClaims = claims.filter((c) => c.status === "rejected");
  const partialClaims = claims.filter((c) => c.status === "partial");
  const appealedClaims = claims.filter((c) => c.status === "appealed");

  return (
    <AppShell>
      <AppHeader
        title="Scheme Responses"
        description="Track claim responses from medical schemes"
      />
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submittedClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accepted
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{acceptedClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{rejectedClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Partial
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{partialClaims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appealed
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appealedClaims.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({submittedClaims.length})
            </TabsTrigger>
            <TabsTrigger value="accepted">
              Accepted ({acceptedClaims.length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({rejectedClaims.length})
            </TabsTrigger>
            <TabsTrigger value="partial">
              Partial ({partialClaims.length})
            </TabsTrigger>
            <TabsTrigger value="appealed">
              Appealed ({appealedClaims.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Responses</CardTitle>
                <CardDescription>
                  Claims submitted to schemes awaiting response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsTable statusFilter={["submitted", "acknowledged"]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accepted">
            <Card>
              <CardHeader>
                <CardTitle>Accepted Claims</CardTitle>
                <CardDescription>
                  Claims approved by schemes for payment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsTable statusFilter={["accepted", "paid"]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Rejected Claims</CardTitle>
                <CardDescription>
                  Claims rejected by schemes - review rejection reasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsTable statusFilter={["rejected"]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="partial">
            <Card>
              <CardHeader>
                <CardTitle>Partial Payments</CardTitle>
                <CardDescription>
                  Claims with partial approval - patient may have liability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsTable statusFilter={["partial"]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appealed">
            <Card>
              <CardHeader>
                <CardTitle>Claims Under Appeal</CardTitle>
                <CardDescription>
                  Previously rejected claims that have been appealed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClaimsTable statusFilter={["appealed"]} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </AppShell>
  );
}
