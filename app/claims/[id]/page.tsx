"use client";

import { use } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { ClaimStatusBadge, SeverityBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  CheckCircle,
  Send,
  AlertTriangle,
  User,
  Building,
  Stethoscope,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react";

interface ClaimDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ClaimDetailPage({ params }: ClaimDetailPageProps) {
  const { id } = use(params);
  const claim = useStore((state) => state.getClaim(id));
  const patient = useStore((state) => state.getPatient(claim?.patientId || ""));
  const scheme = useStore((state) => state.getScheme(claim?.schemeId || ""));
  const plan = useStore((state) => state.getPlan(claim?.planId || ""));
  const provider = useStore((state) => state.getProvider(claim?.providerId || ""));
  const validateClaim = useStore((state) => state.validateClaim);
  const submitClaim = useStore((state) => state.submitClaim);
  const closeClaim = useStore((state) => state.closeClaim);
  const auditLogs = useStore((state) => state.getAuditLogsForEntity("claim", id));

  if (!claim) {
    return (
      <AppShell>
        <AppHeader title="Claim Not Found" />
        <main className="flex-1 p-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">The requested claim could not be found.</p>
            <Button asChild className="mt-4">
              <Link href="/claims">Back to Claims</Link>
            </Button>
          </div>
        </main>
      </AppShell>
    );
  }

  const canValidate = claim.status === "ready" || claim.status === "closed";
  const canSubmit = claim.status === "validated";
  const canClose = claim.status === "draft";

  return (
    <AppShell>
      <AppHeader title={`Claim ${claim.claimNumber}`} description={`Date of Service: ${formatDate(claim.dateOfService)}`}>
        <div className="flex items-center gap-2">
          {canClose && (
            <Button variant="outline" onClick={() => closeClaim(claim.id)}>
              <FileText className="h-4 w-4 mr-2" />
              Close Claim
            </Button>
          )}
          {canValidate && (
            <Button variant="outline" onClick={() => validateClaim(claim.id)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Validate
            </Button>
          )}
          {canSubmit && (
            <Button onClick={() => submitClaim(claim.id)}>
              <Send className="h-4 w-4 mr-2" />
              Submit to Scheme
            </Button>
          )}
        </div>
      </AppHeader>

      <main className="flex-1 p-6 space-y-6">
        {/* Back link */}
        <Link href="/claims" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Claims
        </Link>

        {/* Status & Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ClaimStatusBadge status={claim.status} className="text-base px-3 py-1" />
            {claim.schemeClaimNumber && (
              <span className="text-sm text-muted-foreground">
                Scheme Ref: {claim.schemeClaimNumber}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient & Provider Info */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Patient Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium">
                      {patient?.title} {patient?.firstName} {patient?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Member: {patient?.memberNumber}-{patient?.dependantCode}
                    </p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">ID Number</p>
                      <p className="font-mono">{patient?.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p>{formatDate(patient?.dateOfBirth)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Provider Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Provider
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium">{provider?.name}</p>
                    <p className="text-sm text-muted-foreground">{provider?.specialty}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Practice #</p>
                      <p className="font-mono">{provider?.practiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">HPCSA #</p>
                      <p className="font-mono">{provider?.hpcsaNumber}</p>
                    </div>
                  </div>
                  {provider?.facilityName && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Facility</p>
                      <p>{provider.facilityName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Scheme Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Medical Scheme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Scheme</p>
                    <p className="font-medium">{scheme?.name}</p>
                    <p className="text-xs text-muted-foreground">Reg: {scheme?.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-medium">{plan?.name}</p>
                    <Badge variant="outline" className="mt-1">{plan?.code}</Badge>
                  </div>
                  {claim.authorizationNumber && (
                    <div>
                      <p className="text-sm text-muted-foreground">Authorization</p>
                      <p className="font-mono">{claim.authorizationNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Line Items</CardTitle>
                <CardDescription>Procedures and services billed</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>ICD-10</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claim.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-muted-foreground">
                          {item.lineNumber}
                        </TableCell>
                        <TableCell className="font-mono">{item.tariffCode}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          {item.icd10Codes.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.icd10Codes.map((code) => (
                                <Badge key={code} variant="secondary" className="font-mono text-xs">
                                  {code}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-destructive text-sm">Missing</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right font-mono">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium">
                          {formatCurrency(item.totalPrice)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={6} className="text-right font-medium">
                        Total Billed
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold">
                        {formatCurrency(claim.totalBilled)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Validation Results */}
            {claim.validationResults && claim.validationResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Validation Results
                  </CardTitle>
                  <CardDescription>
                    Last validated: {formatDateTime(claim.lastValidatedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claim.validationResults.map((result, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          result.passed ? "bg-success/10" : 
                          result.severity === "error" ? "bg-destructive/10" :
                          result.severity === "warning" ? "bg-warning/10" : "bg-info/10"
                        }`}
                      >
                        <div className="mt-0.5">
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className={`h-4 w-4 ${
                              result.severity === "error" ? "text-destructive" :
                              result.severity === "warning" ? "text-warning" : "text-info"
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{result.ruleName}</span>
                            <SeverityBadge severity={result.severity} />
                          </div>
                          <p className="text-sm">{result.message}</p>
                          {result.suggestion && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Suggestion: {result.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rejection Reasons */}
            {claim.rejectionReasons && claim.rejectionReasons.length > 0 && (
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-base text-destructive">Rejection Reasons</CardTitle>
                  <CardDescription>{claim.responseMessage}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {claim.rejectionReasons.map((reason, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                        <div>
                          <p className="font-mono text-sm">{reason.code}</p>
                          <p className="text-sm">{reason.description}</p>
                          {reason.appealable && (
                            <Badge variant="outline" className="mt-2">Appealable</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Timeline & Financials */}
          <div className="space-y-6">
            {/* Financials */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Financials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Billed</span>
                  <span className="font-mono font-medium">{formatCurrency(claim.totalBilled)}</span>
                </div>
                {claim.totalApproved !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approved</span>
                    <span className="font-mono">{formatCurrency(claim.totalApproved)}</span>
                  </div>
                )}
                {claim.totalPaid !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-mono text-success">{formatCurrency(claim.totalPaid)}</span>
                  </div>
                )}
                {claim.patientLiability !== undefined && claim.patientLiability > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patient Liability</span>
                    <span className="font-mono text-warning">{formatCurrency(claim.patientLiability)}</span>
                  </div>
                )}
                {claim.adjustmentAmount !== undefined && claim.adjustmentAmount !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adjustment</span>
                    <span className="font-mono">{formatCurrency(claim.adjustmentAmount)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "Created", date: claim.dateCreated },
                    { label: "Closed", date: claim.dateClosed },
                    { label: "Submitted", date: claim.dateSubmitted },
                    { label: "Response", date: claim.dateResponse },
                    { label: "Paid", date: claim.datePaid },
                    { label: "Reconciled", date: claim.dateReconciled },
                  ].filter((item) => item.date).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(item.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {claim.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{claim.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Audit Trail */}
            {auditLogs.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="text-sm">
                        <p>{log.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(log.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
