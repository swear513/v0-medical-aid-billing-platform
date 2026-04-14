"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  FileText,
  ArrowRight,
  RefreshCcw,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/lib/format"

const demoScenarios = [
  {
    id: "clean-success",
    name: "Clean Success Path",
    description: "A claim that passes all validations and gets paid in full",
    status: "success",
    expectedFlow: ["Readiness", "Closure", "Validation", "Submission", "Paid"],
    claimId: "CLM-2024-001"
  },
  {
    id: "missing-icd10",
    name: "Missing ICD-10 Code",
    description: "Claim rejected at validation due to missing diagnosis codes",
    status: "error",
    expectedFlow: ["Readiness", "Closure", "Validation Error"],
    claimId: "CLM-2024-002"
  },
  {
    id: "partial-payment",
    name: "Partial Payment",
    description: "Claim paid at 60% due to scheme limits",
    status: "warning",
    expectedFlow: ["Readiness", "Closure", "Validation", "Submission", "Partial Payment"],
    claimId: "CLM-2024-003"
  },
  {
    id: "rejected-non-dsp",
    name: "Rejected - Non-DSP Provider",
    description: "Claim rejected because provider is not a Designated Service Provider",
    status: "error",
    expectedFlow: ["Readiness", "Closure", "Validation", "Submission", "Rejected"],
    claimId: "CLM-2024-004"
  },
  {
    id: "chronic-auth-required",
    name: "Chronic Authorization Required",
    description: "Claim pending authorization for chronic medication",
    status: "warning",
    expectedFlow: ["Readiness", "Closure", "Validation", "Authorization Pending"],
    claimId: "CLM-2024-005"
  },
  {
    id: "pmb-condition",
    name: "PMB Condition Claim",
    description: "Prescribed Minimum Benefit claim - must be paid by scheme",
    status: "success",
    expectedFlow: ["Readiness", "Closure", "Validation", "Submission", "Paid (PMB)"],
    claimId: "CLM-2024-006"
  },
  {
    id: "duplicate-claim",
    name: "Duplicate Claim Detection",
    description: "Claim flagged as potential duplicate of an existing submission",
    status: "warning",
    expectedFlow: ["Readiness", "Closure", "Validation Warning"],
    claimId: "CLM-2024-007"
  },
  {
    id: "pricing-variance",
    name: "Pricing Variance",
    description: "Claim amount adjusted down due to NHRPL reference pricing",
    status: "warning",
    expectedFlow: ["Readiness", "Closure", "Validation", "Submission", "Adjusted Payment"],
    claimId: "CLM-2024-008"
  },
  {
    id: "late-submission",
    name: "Late Submission",
    description: "Claim submitted after scheme deadline - risk of rejection",
    status: "warning",
    expectedFlow: ["Late Submission Warning", "Review Required"],
    claimId: "CLM-2024-009"
  },
  {
    id: "procedure-auth",
    name: "Procedure Pre-Authorization",
    description: "Surgical procedure requires pre-auth from scheme",
    status: "success",
    expectedFlow: ["Pre-Auth Approved", "Submission", "Paid"],
    claimId: "CLM-2024-010"
  },
  {
    id: "hospital-admission",
    name: "Hospital Admission",
    description: "Full hospitalisation claim with multiple line items",
    status: "success",
    expectedFlow: ["Admission", "Services", "Discharge", "Submission", "Processing"],
    claimId: "CLM-2024-011"
  }
]

export default function DemoPage() {
  const { claims, resetStore } = useStore()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "error": return <XCircle className="h-5 w-5 text-destructive" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default: return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Success Path</Badge>
      case "error": return <Badge variant="destructive">Error Path</Badge>
      case "warning": return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Warning Path</Badge>
      default: return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Demo Scenarios</h1>
          <p className="text-muted-foreground">
            Pre-configured test cases demonstrating the complete claim lifecycle
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => {
            if (confirm("Reset all data to initial demo state?")) {
              resetStore()
              window.location.reload()
            }
          }}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset Demo Data
        </Button>
      </div>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>11 Pre-seeded Scenarios</AlertTitle>
        <AlertDescription>
          Each scenario demonstrates a different path through the SA medical billing lifecycle. 
          Click on any scenario to view and interact with the claim.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoScenarios.map(scenario => {
          const claim = claims.find(c => c.id === scenario.claimId)
          return (
            <Card key={scenario.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${
                scenario.status === "success" ? "bg-emerald-500" :
                scenario.status === "error" ? "bg-destructive" :
                "bg-amber-500"
              }`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(scenario.status)}
                    <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  </div>
                  {getStatusBadge(scenario.status)}
                </div>
                <CardDescription className="line-clamp-2">
                  {scenario.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Expected Flow */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Expected Flow:</p>
                  <div className="flex flex-wrap items-center gap-1">
                    {scenario.expectedFlow.map((step, idx) => (
                      <span key={idx} className="flex items-center">
                        <Badge variant="outline" className="text-xs">
                          {step}
                        </Badge>
                        {idx < scenario.expectedFlow.length - 1 && (
                          <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Claim Info */}
                {claim && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Claim ID:</span>
                      <span className="font-mono">{claim.id}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{formatCurrency(claim.totalAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Status:</span>
                      <Badge variant="outline" className="capitalize">
                        {claim.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Action */}
                <Button 
                  className="w-full" 
                  variant="outline"
                  asChild
                >
                  <Link href={`/claims/${scenario.claimId}`}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    View Scenario
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Navigation</CardTitle>
          <CardDescription>Jump to key areas of the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/claims">All Claims</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/claims/validation">Validation Queue</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/claims/submission">Submission Queue</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/claims/responses">Scheme Responses</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/billing/remittance">Remittance Advices</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/billing/reconciliation">Reconciliation</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/rules">Rules Engine</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/audit">Audit Logs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
