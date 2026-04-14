"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Receipt, 
  Search, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Banknote,
  Building2,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/format"
import { StatusBadge } from "@/components/status-badge"

export default function RemittancePage() {
  const { remittanceAdvices, claims, schemes, currentRole } = useStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [schemeFilter, setSchemeFilter] = useState<string>("all")
  const [selectedRA, setSelectedRA] = useState<string | null>(null)

  const canProcess = ["administrator", "finance_officer", "billing_specialist"].includes(currentRole)

  const filteredRAs = remittanceAdvices.filter(ra => {
    const matchesSearch = ra.id.toLowerCase().includes(search.toLowerCase()) ||
      ra.schemeId.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || ra.status === statusFilter
    const matchesScheme = schemeFilter === "all" || ra.schemeId === schemeFilter
    return matchesSearch && matchesStatus && matchesScheme
  })

  const selectedRemittance = selectedRA ? remittanceAdvices.find(ra => ra.id === selectedRA) : null

  // Calculate summary stats
  const totalPaid = filteredRAs.reduce((sum, ra) => sum + ra.totalPaid, 0)
  const totalClaims = filteredRAs.reduce((sum, ra) => sum + ra.claimIds.length, 0)
  const pendingCount = filteredRAs.filter(ra => ra.status === "pending").length
  const processedCount = filteredRAs.filter(ra => ra.status === "processed").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Remittance Advices</h1>
          <p className="text-muted-foreground">
            Process and reconcile payment advices from medical schemes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Import RA
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              From {filteredRAs.length} remittance advices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Covered</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims}</div>
            <p className="text-xs text-muted-foreground">
              Across all advices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">{processedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully reconciled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by RA number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processed">Processed</SelectItem>
            <SelectItem value="disputed">Disputed</SelectItem>
          </SelectContent>
        </Select>
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

      {/* Remittance Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>RA Number</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>Date Received</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Claims</TableHead>
                <TableHead className="text-right">Total Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRAs.map(ra => {
                const scheme = schemes.find(s => s.id === ra.schemeId)
                return (
                  <TableRow key={ra.id}>
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">{ra.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {scheme?.name || ra.schemeId}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(ra.receivedDate)}</TableCell>
                    <TableCell>{formatDate(ra.paymentDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{ra.claimIds.length} claims</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(ra.totalPaid)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ra.status} type="remittance" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedRA(ra.id)}
                      >
                        View
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {filteredRAs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Receipt className="h-8 w-8 mb-2 opacity-50" />
                      <p>No remittance advices found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RA Detail Dialog */}
      <Dialog open={!!selectedRA} onOpenChange={() => setSelectedRA(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedRemittance && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Remittance Advice: {selectedRemittance.id}
                </DialogTitle>
                <DialogDescription>
                  Review payment details and line items
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* RA Summary */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Scheme</p>
                    <p className="font-medium">{schemes.find(s => s.id === selectedRemittance.schemeId)?.name}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Payment Date</p>
                    <p className="font-medium">{formatDate(selectedRemittance.paymentDate)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium text-emerald-500">{formatCurrency(selectedRemittance.totalPaid)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <StatusBadge status={selectedRemittance.status} type="remittance" />
                  </div>
                </div>

                {/* Line Items */}
                <div>
                  <h4 className="font-medium mb-3">Payment Line Items ({selectedRemittance.lineItems.length})</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Claim ID</TableHead>
                        <TableHead className="text-right">Billed</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                        <TableHead>Reason Code</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRemittance.lineItems.map((item, idx) => {
                        const variance = item.amountPaid - item.amountBilled
                        const variancePercent = ((variance / item.amountBilled) * 100).toFixed(1)
                        return (
                          <TableRow key={idx}>
                            <TableCell>
                              <Link 
                                href={`/claims/${item.claimId}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.claimId}
                              </Link>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.amountBilled)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.amountPaid)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {variance < 0 ? (
                                  <TrendingDown className="h-3 w-3 text-destructive" />
                                ) : variance > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                                ) : null}
                                <span className={variance < 0 ? "text-destructive" : variance > 0 ? "text-emerald-500" : ""}>
                                  {formatCurrency(variance)} ({variancePercent}%)
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {item.reasonCode ? (
                                <Badge variant="outline">{item.reasonCode}</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedRA(null)}>Close</Button>
                {canProcess && selectedRemittance.status === "pending" && (
                  <Button>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Processed
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
