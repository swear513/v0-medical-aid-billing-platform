"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Search, 
  Plus, 
  Settings2,
  Phone,
  Mail,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/format"

export default function SchemesPage() {
  const { schemes, claims, currentRole } = useStore()
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const canManage = ["administrator"].includes(currentRole)

  const filteredSchemes = schemes.filter(scheme => 
    scheme.name.toLowerCase().includes(search.toLowerCase()) ||
    scheme.id.toLowerCase().includes(search.toLowerCase())
  )

  const getSchemeStats = (schemeId: string) => {
    const schemeClaims = claims.filter(c => c.schemeId === schemeId)
    const totalClaims = schemeClaims.length
    const totalBilled = schemeClaims.reduce((sum, c) => sum + c.totalAmount, 0)
    const paidClaims = schemeClaims.filter(c => c.status === "paid" || c.status === "partial_payment")
    const totalPaid = paidClaims.reduce((sum, c) => sum + (c.paidAmount || 0), 0)
    const pendingClaims = schemeClaims.filter(c => 
      c.status === "submitted" || c.status === "validated" || c.status === "closure_ready"
    ).length

    return { totalClaims, totalBilled, totalPaid, pendingClaims }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medical Schemes</h1>
          <p className="text-muted-foreground">
            Manage scheme configurations and view performance metrics
          </p>
        </div>
        {canManage && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Scheme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Medical Scheme</DialogTitle>
                <DialogDescription>
                  Register a new medical scheme in the system
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="scheme-id">Scheme ID</Label>
                  <Input id="scheme-id" placeholder="e.g., discovery-health" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheme-name">Scheme Name</Label>
                  <Input id="scheme-name" placeholder="e.g., Discovery Health Medical Scheme" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheme-contact">Contact Email</Label>
                  <Input id="scheme-contact" type="email" placeholder="claims@scheme.co.za" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scheme-phone">Phone Number</Label>
                  <Input id="scheme-phone" placeholder="+27 XXX XXX XXXX" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Electronic Claims</Label>
                  <Switch defaultChecked />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setCreateOpen(false)}>Add Scheme</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search schemes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSchemes.map(scheme => {
          const stats = getSchemeStats(scheme.id)
          return (
            <Card key={scheme.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{scheme.name}</CardTitle>
                      <CardDescription className="text-xs">{scheme.id}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={scheme.electronicClaims ? "default" : "secondary"}>
                    {scheme.electronicClaims ? "Electronic" : "Manual"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="flex flex-col gap-1 text-sm">
                  {scheme.contactEmail && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{scheme.contactEmail}</span>
                    </div>
                  )}
                  {scheme.contactPhone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{scheme.contactPhone}</span>
                    </div>
                  )}
                  {scheme.submissionUrl && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5" />
                      <span className="truncate">{scheme.submissionUrl}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Claims</p>
                    <p className="text-lg font-semibold">{stats.totalClaims}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending</p>
                    <p className="text-lg font-semibold text-amber-500">{stats.pendingClaims}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Billed</p>
                    <p className="text-sm font-medium">{formatCurrency(stats.totalBilled)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Paid</p>
                    <p className="text-sm font-medium text-emerald-500">{formatCurrency(stats.totalPaid)}</p>
                  </div>
                </div>

                {/* Actions */}
                {canManage && (
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings2 className="mr-2 h-3.5 w-3.5" />
                    Configure
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSchemes.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No schemes found</p>
            <p className="text-sm">Try adjusting your search</p>
          </div>
        </Card>
      )}
    </div>
  )
}
