"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Scale, 
  Search, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  FileWarning,
  DollarSign,
  Percent,
  RefreshCcw
} from "lucide-react"
import { useState, useMemo } from "react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

type ReconciliationStatus = "matched" | "partial" | "unmatched" | "disputed"

interface ReconciliationItem {
  claimId: string
  patientName: string
  schemeId: string
  billedAmount: number
  paidAmount: number
  variance: number
  variancePercent: number
  status: ReconciliationStatus
  raId?: string
  reasonCodes: string[]
}

export default function ReconciliationPage() {
  const { claims, remittanceAdvices, schemes, currentRole } = useStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [schemeFilter, setSchemeFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")

  const canProcess = ["administrator", "finance_officer"].includes(currentRole)

  // Build reconciliation data from claims and RAs
  const reconciliationData = useMemo<ReconciliationItem[]>(() => {
    return claims
      .filter(claim => claim.status === "paid" || claim.status === "partial_payment")
      .map(claim => {
        // Find RA line items for this claim
        const raLineItems = remittanceAdvices.flatMap(ra => 
          ra.lineItems
            .filter(li => li.claimId === claim.id)
            .map(li => ({ ...li, raId: ra.id }))
        )

        const paidAmount = raLineItems.reduce((sum, li) => sum + li.amountPaid, 0)
        const billedAmount = claim.totalAmount
        const variance = paidAmount - billedAmount
        const variancePercent = billedAmount > 0 ? (variance / billedAmount) * 100 : 0

        let status: ReconciliationStatus = "unmatched"
        if (raLineItems.length > 0) {
          if (Math.abs(variance) < 0.01) {
            status = "matched"
          } else if (variancePercent < -20) {
            status = "disputed"
          } else {
            status = "partial"
          }
        }

        return {
          claimId: claim.id,
          patientName: claim.patientName,
          schemeId: claim.schemeId,
          billedAmount,
          paidAmount,
          variance,
          variancePercent,
          status,
          raId: raLineItems[0]?.raId,
          reasonCodes: raLineItems.flatMap(li => li.reasonCode ? [li.reasonCode] : [])
        }
      })
  }, [claims, remittanceAdvices])

  const filteredData = reconciliationData.filter(item => {
    const matchesSearch = item.claimId.toLowerCase().includes(search.toLowerCase()) ||
      item.patientName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesScheme = schemeFilter === "all" || item.schemeId === schemeFilter
    return matchesSearch && matchesStatus && matchesScheme
  })

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalBilled = reconciliationData.reduce((sum, item) => sum + item.billedAmount, 0)
    const totalPaid = reconciliationData.reduce((sum, item) => sum + item.paidAmount, 0)
    const totalVariance = totalPaid - totalBilled
    const matchedCount = reconciliationData.filter(i => i.status === "matched").length
    const partialCount = reconciliationData.filter(i => i.status === "partial").length
    const unmatchedCount = reconciliationData.filter(i => i.status === "unmatched").length
    const disputedCount = reconciliationData.filter(i => i.status === "disputed").length
    const matchRate = reconciliationData.length > 0 
      ? ((matchedCount / reconciliationData.length) * 100).toFixed(1) 
      : "0"

    return {
      totalBilled,
      totalPaid,
      totalVariance,
      matchedCount,
      partialCount,
      unmatchedCount,
      disputedCount,
      matchRate
    }
  }, [reconciliationData])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reconciliation</h1>
          <p className="text-muted-foreground">
            Match payments with billed claims and identify variances
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Run Auto-Match
          </Button>
          <Button>
            <FileWarning className="mr-2 h-4 w-4" />
            Export Variances
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBilled)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{formatCurrency(stats.totalPaid)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {stats.totalVariance < 0 ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalVariance < 0 ? "text-destructive" : "text-emerald-500"}`}>
              {formatCurrency(stats.totalVariance)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matchRate}%</div>
            <Progress value={parseFloat(stats.matchRate)} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputed</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.disputedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires review</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="matched" className="gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Matched ({stats.matchedCount})
          </TabsTrigger>
          <TabsTrigger value="partial" className="gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            Partial ({stats.partialCount})
          </TabsTrigger>
          <TabsTrigger value="unmatched" className="gap-2">
            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
            Unmatched ({stats.unmatchedCount})
          </TabsTrigger>
          <TabsTrigger value="disputed" className="gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            Disputed ({stats.disputedCount})
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search claims..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={schemeFilter} onValueChange={setSchemeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Schemes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schemes</SelectItem>
              {schemes.map(scheme => (
                <SelectItem key={scheme.id} value={scheme.id}>{scheme.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <ReconciliationTable 
            data={filteredData} 
            schemes={schemes}
            canProcess={canProcess}
          />
        </TabsContent>

        <TabsContent value="matched" className="space-y-4">
          <ReconciliationTable 
            data={filteredData.filter(i => i.status === "matched")} 
            schemes={schemes}
            canProcess={canProcess}
          />
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          <ReconciliationTable 
            data={filteredData.filter(i => i.status === "partial")} 
            schemes={schemes}
            canProcess={canProcess}
          />
        </TabsContent>

        <TabsContent value="unmatched" className="space-y-4">
          <ReconciliationTable 
            data={filteredData.filter(i => i.status === "unmatched")} 
            schemes={schemes}
            canProcess={canProcess}
          />
        </TabsContent>

        <TabsContent value="disputed" className="space-y-4">
          <ReconciliationTable 
            data={filteredData.filter(i => i.status === "disputed")} 
            schemes={schemes}
            canProcess={canProcess}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReconciliationTable({ 
  data, 
  schemes,
  canProcess 
}: { 
  data: ReconciliationItem[]
  schemes: { id: string; name: string }[]
  canProcess: boolean 
}) {
  const getStatusBadge = (status: ReconciliationStatus) => {
    switch (status) {
      case "matched":
        return <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">Matched</Badge>
      case "partial":
        return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Partial</Badge>
      case "unmatched":
        return <Badge variant="outline">Unmatched</Badge>
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead className="text-right">Billed</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead>Reason Codes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(item => {
              const scheme = schemes.find(s => s.id === item.schemeId)
              return (
                <TableRow key={item.claimId}>
                  <TableCell>
                    <Link 
                      href={`/claims/${item.claimId}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.claimId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.patientName}</TableCell>
                  <TableCell>{scheme?.name || item.schemeId}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.billedAmount)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.paidAmount)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.variance < 0 ? (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      ) : item.variance > 0 ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      ) : null}
                      <span className={item.variance < 0 ? "text-destructive" : item.variance > 0 ? "text-emerald-500" : ""}>
                        {formatCurrency(item.variance)}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({item.variancePercent.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.reasonCodes.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {item.reasonCodes.slice(0, 2).map(code => (
                          <Badge key={code} variant="outline" className="text-xs">{code}</Badge>
                        ))}
                        {item.reasonCodes.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{item.reasonCodes.length - 2}</Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/claims/${item.claimId}`}>
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Scale className="h-8 w-8 mb-2 opacity-50" />
                    <p>No reconciliation items found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
