"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  History, 
  Search, 
  Download,
  Filter,
  User,
  FileText,
  Shield,
  Settings,
  Eye,
  ChevronRight
} from "lucide-react"
import { useState } from "react"
import { formatDateTime, formatDate } from "@/lib/format"
import type { AuditLog } from "@/lib/types"

export default function AuditPage() {
  const { auditLogs, currentRole } = useStore()
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [entityFilter, setEntityFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const canView = ["administrator", "compliance_auditor"].includes(currentRole)

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Shield className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold">Access Restricted</h2>
        <p className="text-muted-foreground">You do not have permission to view audit logs</p>
      </div>
    )
  }

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.entityId.toLowerCase().includes(search.toLowerCase()) ||
      log.userId.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase())
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesEntity = entityFilter === "all" || log.entityType === entityFilter
    return matchesSearch && matchesAction && matchesEntity
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const uniqueActions = [...new Set(auditLogs.map(log => log.action))]
  const uniqueEntities = [...new Set(auditLogs.map(log => log.entityType))]

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "bg-emerald-500/20 text-emerald-500 border-emerald-500/30"
      case "update": return "bg-blue-500/20 text-blue-500 border-blue-500/30"
      case "delete": return "bg-destructive/20 text-destructive border-destructive/30"
      case "submit": return "bg-purple-500/20 text-purple-500 border-purple-500/30"
      case "validate": return "bg-amber-500/20 text-amber-500 border-amber-500/30"
      case "process": return "bg-cyan-500/20 text-cyan-500 border-cyan-500/30"
      default: return ""
    }
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "claim": return <FileText className="h-4 w-4" />
      case "rule": return <Shield className="h-4 w-4" />
      case "user": return <User className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Track all system activities and changes for compliance
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => 
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Events logged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claim Events</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => log.entityType === "claim").length}
            </div>
            <p className="text-xs text-muted-foreground">Claim-related</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rule Changes</CardTitle>
            <Shield className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {auditLogs.filter(log => log.entityType === "rule").length}
            </div>
            <p className="text-xs text-muted-foreground">Rule modifications</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action} className="capitalize">{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={entityFilter} onValueChange={setEntityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Entities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {uniqueEntities.map(entity => (
              <SelectItem key={entity} value={entity} className="capitalize">{entity}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice(0, 50).map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">
                    {formatDateTime(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="text-sm">{log.userId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEntityIcon(log.entityType)}
                      <span className="capitalize">{log.entityType}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.entityId}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {log.details || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <History className="h-8 w-8 mb-2 opacity-50" />
                      <p>No audit logs found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredLogs.length > 50 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing 50 of {filteredLogs.length} logs. Use filters to narrow down results.
        </p>
      )}

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-lg">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Log Details
                </DialogTitle>
                <DialogDescription>
                  Event ID: {selectedLog.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Timestamp</p>
                    <p className="font-mono text-sm">{formatDateTime(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedLog.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Action</p>
                    <Badge className={getActionColor(selectedLog.action)}>
                      {selectedLog.action}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entity Type</p>
                    <p className="capitalize">{selectedLog.entityType}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Entity ID</p>
                  <p className="font-mono bg-muted p-2 rounded text-sm">{selectedLog.entityId}</p>
                </div>

                {selectedLog.details && (
                  <div>
                    <p className="text-sm text-muted-foreground">Details</p>
                    <p className="bg-muted p-2 rounded text-sm">{selectedLog.details}</p>
                  </div>
                )}

                {selectedLog.metadata && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Metadata</p>
                    <ScrollArea className="h-40">
                      <pre className="font-mono text-xs bg-muted p-3 rounded overflow-x-auto">
                        {JSON.stringify(selectedLog.metadata, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}

                {selectedLog.ipAddress && (
                  <div>
                    <p className="text-sm text-muted-foreground">IP Address</p>
                    <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
