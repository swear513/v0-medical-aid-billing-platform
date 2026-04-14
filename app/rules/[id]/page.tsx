"use client"

import { useStore } from "@/lib/store"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Shield, Code, History, TestTube, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { formatDate } from "@/lib/format"

export default function RuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { rules, toggleRuleStatus, currentRole } = useStore()
  
  const rule = rules.find(r => r.id === params.id)
  
  if (!rule) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Rule not found</h2>
        <p className="text-muted-foreground mb-4">The requested rule does not exist</p>
        <Button onClick={() => router.push("/rules")}>Back to Rules</Button>
      </div>
    )
  }

  const canManage = ["administrator", "compliance_auditor"].includes(currentRole)

  const severityColors = {
    error: "destructive",
    warning: "secondary",
    info: "outline"
  } as const

  const severityIcons = {
    error: AlertTriangle,
    warning: Info,
    info: CheckCircle
  }

  const SeverityIcon = severityIcons[rule.severity]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{rule.name}</h1>
            <Badge variant={severityColors[rule.severity]}>
              <SeverityIcon className="mr-1 h-3 w-3" />
              {rule.severity}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{rule.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="active-toggle" className="text-sm">Active</Label>
            <Switch 
              id="active-toggle"
              checked={rule.isActive}
              onCheckedChange={() => canManage && toggleRuleStatus(rule.id)}
              disabled={!canManage}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Category</CardDescription>
            <CardTitle className="text-lg capitalize">{rule.category}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Applies To</CardDescription>
            <CardTitle className="text-lg capitalize">{rule.appliesTo}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Version</CardDescription>
            <CardTitle className="text-lg">v{rule.version}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Last Updated</CardDescription>
            <CardTitle className="text-lg">{formatDate(rule.updatedAt)}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="logic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logic">
            <Code className="mr-2 h-4 w-4" />
            Rule Logic
          </TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
          <TabsTrigger value="testing">
            <TestTube className="mr-2 h-4 w-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Definition</CardTitle>
              <CardDescription>The logic that determines when this rule triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                <pre className="text-foreground/80">
{`// Rule: ${rule.name}
// Category: ${rule.category}
// Severity: ${rule.severity}

function evaluate(claim) {
  ${rule.condition.field ? `const ${rule.condition.field} = claim.${rule.condition.field};` : '// Field extraction'}
  
  ${rule.condition.operator === 'exists' 
    ? `if (!${rule.condition.field || 'value'}) {
    return { valid: false, message: "${rule.message}" };
  }`
    : rule.condition.operator === 'matches'
    ? `const pattern = /${rule.condition.value}/;
  if (!pattern.test(${rule.condition.field || 'value'})) {
    return { valid: false, message: "${rule.message}" };
  }`
    : `if (!(${rule.condition.field || 'value'} ${rule.condition.operator} ${JSON.stringify(rule.condition.value)})) {
    return { valid: false, message: "${rule.message}" };
  }`
  }
  
  return { valid: true };
}`}
                </pre>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Error Message</Label>
                  <p className="mt-1 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm">
                    {rule.message}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Resolution Guidance</Label>
                  <p className="mt-1 p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm">
                    {rule.resolution || "Ensure the claim data meets the required criteria before resubmission."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Condition Details</CardTitle>
              <CardDescription>The specific conditions that must be met</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <Label className="text-muted-foreground text-xs uppercase">Field</Label>
                    <p className="font-mono mt-1">{rule.condition.field || "N/A"}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-muted-foreground text-xs uppercase">Operator</Label>
                    <p className="font-mono mt-1">{rule.condition.operator}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-muted-foreground text-xs uppercase">Expected Value</Label>
                    <p className="font-mono mt-1">{rule.condition.value?.toString() || "N/A"}</p>
                  </div>
                </div>
                {rule.metadata && (
                  <div className="p-4 border rounded-lg">
                    <Label className="text-muted-foreground text-xs uppercase mb-2 block">Metadata</Label>
                    <pre className="font-mono text-sm bg-muted p-3 rounded overflow-x-auto">
                      {JSON.stringify(rule.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rule Testing</CardTitle>
              <CardDescription>Test this rule against sample claim data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="mb-2 block">Sample Input</Label>
                  <div className="p-4 bg-muted rounded-lg font-mono text-sm h-48 overflow-auto">
                    <pre>{JSON.stringify({
                      claimId: "CLM-TEST-001",
                      patientName: "Test Patient",
                      icd10Codes: ["J06.9"],
                      procedureCodes: ["0190"],
                      totalAmount: 1500.00,
                      serviceDate: "2024-01-15"
                    }, null, 2)}</pre>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Test Result</Label>
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg h-48">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Rule Passed</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      The sample claim data satisfies all conditions for this rule.
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <TestTube className="mr-2 h-4 w-4" />
                Run Test with Custom Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Change History</CardTitle>
              <CardDescription>Track modifications to this rule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { version: rule.version, date: rule.updatedAt, change: "Current version", author: "System" },
                  { version: rule.version - 0.1, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), change: "Updated error message clarity", author: "Compliance Team" },
                  { version: 1.0, date: rule.createdAt, change: "Initial rule creation", author: "System" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      v{item.version.toFixed(1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.change}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(item.date)} by {item.author}
                      </p>
                    </div>
                    {idx === 0 && <Badge>Current</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
