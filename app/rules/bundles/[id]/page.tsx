"use client"

import { useStore } from "@/lib/store"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Package, Shield, AlertTriangle, CheckCircle, History, Settings2 } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/format"

export default function BundleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { decisionBundles, rules, toggleRuleStatus, currentRole } = useStore()
  
  const bundle = decisionBundles.find(b => b.id === params.id)
  
  if (!bundle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Bundle not found</h2>
        <p className="text-muted-foreground mb-4">The requested bundle does not exist</p>
        <Button onClick={() => router.push("/rules/bundles")}>Back to Bundles</Button>
      </div>
    )
  }

  const bundleRules = bundle.ruleIds.map(id => rules.find(r => r.id === id)).filter(Boolean)
  const canManage = ["administrator", "compliance_auditor"].includes(currentRole)

  const rulesByCategory = bundleRules.reduce((acc, rule) => {
    if (!rule) return acc
    if (!acc[rule.category]) acc[rule.category] = []
    acc[rule.category].push(rule)
    return acc
  }, {} as Record<string, typeof rules>)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{bundle.name}</h1>
            <Badge variant={bundle.status === "active" ? "default" : "secondary"}>
              {bundle.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{bundle.description}</p>
        </div>
        {canManage && (
          <Button variant="outline">
            <Settings2 className="mr-2 h-4 w-4" />
            Configure
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rules</CardDescription>
            <CardTitle className="text-2xl">{bundleRules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Rules</CardDescription>
            <CardTitle className="text-2xl text-emerald-500">
              {bundleRules.filter(r => r?.isActive).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Scheme</CardDescription>
            <CardTitle className="text-lg">{bundle.schemeId || "All Schemes"}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Version</CardDescription>
            <CardTitle className="text-lg">v{bundle.version}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Rules ({bundleRules.length})</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
          <TabsTrigger value="usage">Usage Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {Object.entries(rulesByCategory).map(([category, categoryRules]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg capitalize flex items-center gap-2">
                  {category === "coding" && <Shield className="h-4 w-4" />}
                  {category === "compliance" && <CheckCircle className="h-4 w-4" />}
                  {category === "pricing" && <AlertTriangle className="h-4 w-4" />}
                  {category} Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rule Name</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead className="text-right">Active</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryRules.map(rule => rule && (
                      <TableRow key={rule.id}>
                        <TableCell>
                          <Link 
                            href={`/rules/${rule.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {rule.name}
                          </Link>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {rule.description}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            rule.severity === "error" ? "destructive" :
                            rule.severity === "warning" ? "secondary" : "outline"
                          }>
                            {rule.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{rule.appliesTo}</TableCell>
                        <TableCell className="text-right">
                          <Switch 
                            checked={rule.isActive}
                            onCheckedChange={() => canManage && toggleRuleStatus(rule.id)}
                            disabled={!canManage}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-4 w-4" />
                Version History
              </CardTitle>
              <CardDescription>Track changes to this bundle over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { version: bundle.version, date: bundle.updatedAt, changes: "Current version", author: "System" },
                  { version: bundle.version - 0.1, date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), changes: "Added 2 new compliance rules", author: "Admin" },
                  { version: bundle.version - 0.2, date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), changes: "Updated pricing thresholds", author: "Finance" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      v{item.version.toFixed(1)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.changes}</p>
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

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Usage Statistics</CardTitle>
              <CardDescription>How this bundle is performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary">1,247</p>
                  <p className="text-sm text-muted-foreground">Claims Processed</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-500">94.2%</p>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-amber-500">72</p>
                  <p className="text-sm text-muted-foreground">Violations Caught</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
