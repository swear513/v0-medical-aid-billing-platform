"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Package, Plus, Search, Play, Pause, Eye, Settings2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/format"

export default function BundlesPage() {
  const { decisionBundles, rules, toggleBundleStatus, currentRole } = useStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [createOpen, setCreateOpen] = useState(false)

  const canManage = ["administrator", "compliance_auditor"].includes(currentRole)

  const filteredBundles = decisionBundles.filter(bundle => {
    const matchesSearch = bundle.name.toLowerCase().includes(search.toLowerCase()) ||
      bundle.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || bundle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeRulesCount = (ruleIds: string[]) => {
    return ruleIds.filter(id => rules.find(r => r.id === id)?.isActive).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Bundles</h1>
          <p className="text-muted-foreground">
            Manage rule bundles for different medical schemes and claim types
          </p>
        </div>
        {canManage && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Decision Bundle</DialogTitle>
                <DialogDescription>
                  Group rules together for specific schemes or claim types
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Bundle Name</Label>
                  <Input id="name" placeholder="e.g., Discovery Health Standard" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Describe the bundle purpose" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Scheme</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scheme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discovery">Discovery Health</SelectItem>
                        <SelectItem value="bonitas">Bonitas</SelectItem>
                        <SelectItem value="momentum">Momentum Health</SelectItem>
                        <SelectItem value="medshield">Medshield</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Claim Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                        <SelectItem value="hospitalisation">Hospitalisation</SelectItem>
                        <SelectItem value="chronic">Chronic Medication</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Select Rules</Label>
                  <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                    {rules.map(rule => (
                      <div key={rule.id} className="flex items-center space-x-2">
                        <Checkbox id={rule.id} />
                        <label htmlFor={rule.id} className="text-sm flex-1 cursor-pointer">
                          {rule.name}
                        </label>
                        <Badge variant="outline" className="text-xs">
                          {rule.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={() => setCreateOpen(false)}>Create Bundle</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bundles..."
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBundles.map(bundle => (
          <Card key={bundle.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{bundle.name}</CardTitle>
                </div>
                <Badge variant={bundle.status === "active" ? "default" : bundle.status === "draft" ? "secondary" : "outline"}>
                  {bundle.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">{bundle.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Scheme</p>
                  <p className="font-medium">{bundle.schemeId || "All Schemes"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Claim Type</p>
                  <p className="font-medium capitalize">{bundle.claimType || "All Types"}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {activeRulesCount(bundle.ruleIds)} / {bundle.ruleIds.length} rules active
                </span>
                <span className="text-muted-foreground text-xs">
                  v{bundle.version}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/rules/bundles/${bundle.id}`}>
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    View
                  </Link>
                </Button>
                {canManage && (
                  <>
                    <Button variant="outline" size="sm">
                      <Settings2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleBundleStatus(bundle.id)}
                    >
                      {bundle.status === "active" ? (
                        <Pause className="h-3.5 w-3.5" />
                      ) : (
                        <Play className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBundles.length === 0 && (
        <Card className="p-12">
          <div className="text-center text-muted-foreground">
            <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No bundles found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}
    </div>
  )
}
