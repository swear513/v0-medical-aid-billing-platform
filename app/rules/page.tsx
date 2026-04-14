"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { AppHeader } from "@/components/app-header";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/format";
import { SeverityBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Eye, BookOpen, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { Rule, RuleCategory } from "@/lib/types";

const categoryLabels: Record<RuleCategory, string> = {
  patient_eligibility: "Patient Eligibility",
  coding_accuracy: "Coding Accuracy",
  clinical_appropriateness: "Clinical Appropriateness",
  pricing_compliance: "Pricing Compliance",
  documentation: "Documentation",
  duplicate_detection: "Duplicate Detection",
  authorization: "Authorization",
};

export default function RulesPage() {
  const rules = useStore((state) => state.rules);
  const toggleRule = useStore((state) => state.toggleRule);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  const activeRules = rules.filter((r) => r.isActive).length;

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      searchTerm === "" ||
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory =
      categoryFilter === "all" || rule.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <AppShell>
      <AppHeader
        title="Validation Rules"
        description="Manage claim validation rules and logic"
      >
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </AppHeader>
      <main className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rules
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rules.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rules
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{activeRules}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Error Rules
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rules.filter((r) => r.severity === "error").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Warning Rules
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rules.filter((r) => r.severity === "warning").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.keys(categoryLabels) as RuleCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rules Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Active</TableHead>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Effective From</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{rule.code}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rule.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {rule.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabels[rule.category]}</Badge>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={rule.severity} />
                    </TableCell>
                    <TableCell>v{rule.version}</TableCell>
                    <TableCell>{formatDate(rule.effectiveFrom)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRule(rule)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {rule.name}
                              <SeverityBadge severity={rule.severity} />
                            </DialogTitle>
                            <DialogDescription>
                              {rule.code} - Version {rule.version}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-4 pr-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Description</h4>
                                <p className="text-sm text-muted-foreground">
                                  {rule.description}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">Category</h4>
                                <Badge variant="outline">
                                  {categoryLabels[rule.category]}
                                </Badge>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Conditions</h4>
                                <div className="space-y-2">
                                  {rule.conditions.map((condition, index) => (
                                    <div
                                      key={index}
                                      className="p-3 rounded-lg bg-muted font-mono text-sm"
                                    >
                                      <span className="text-primary">{condition.field}</span>
                                      <span className="text-muted-foreground mx-2">
                                        {condition.operator}
                                      </span>
                                      <span className="text-success">
                                        {JSON.stringify(condition.value)}
                                      </span>
                                      {condition.logicalOperator && (
                                        <span className="text-warning ml-2">
                                          {condition.logicalOperator}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Actions</h4>
                                <div className="space-y-2">
                                  {rule.actions.map((action, index) => (
                                    <div
                                      key={index}
                                      className="p-3 rounded-lg border"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge>{action.type}</Badge>
                                      </div>
                                      <p className="text-sm">{action.message}</p>
                                      {action.suggestion && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          <Info className="h-3 w-3 inline mr-1" />
                                          {action.suggestion}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Effective From</p>
                                  <p>{formatDate(rule.effectiveFrom)}</p>
                                </div>
                                {rule.effectiveTo && (
                                  <div>
                                    <p className="text-muted-foreground">Effective To</p>
                                    <p>{formatDate(rule.effectiveTo)}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-muted-foreground">Created</p>
                                  <p>{formatDate(rule.createdAt)}</p>
                                </div>
                                {rule.updatedAt && (
                                  <div>
                                    <p className="text-muted-foreground">Last Updated</p>
                                    <p>{formatDate(rule.updatedAt)}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No rules found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
