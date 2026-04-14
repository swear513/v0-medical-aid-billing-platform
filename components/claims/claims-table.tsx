"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate } from "@/lib/format";
import { ClaimStatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Eye, CheckCircle, Send, X } from "lucide-react";
import type { ClaimStatus } from "@/lib/types";

interface ClaimsTableProps {
  statusFilter?: ClaimStatus[];
  showActions?: boolean;
}

export function ClaimsTable({ statusFilter, showActions = true }: ClaimsTableProps) {
  const claims = useStore((state) => state.claims);
  const patients = useStore((state) => state.patients);
  const schemes = useStore((state) => state.schemes);
  const providers = useStore((state) => state.providers);
  const validateClaim = useStore((state) => state.validateClaim);
  const submitClaim = useStore((state) => state.submitClaim);

  const [searchTerm, setSearchTerm] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("dateCreated");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const getPatient = (id: string) => patients.find((p) => p.id === id);
  const getScheme = (id: string) => schemes.find((s) => s.id === id);
  const getProvider = (id: string) => providers.find((p) => p.id === id);

  const filteredClaims = useMemo(() => {
    let result = [...claims];

    // Status filter
    if (statusFilter && statusFilter.length > 0) {
      result = result.filter((c) => statusFilter.includes(c.status));
    }

    // Scheme filter
    if (schemeFilter !== "all") {
      result = result.filter((c) => c.schemeId === schemeFilter);
    }

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const patient = getPatient(c.patientId);
        const scheme = getScheme(c.schemeId);
        return (
          c.claimNumber.toLowerCase().includes(term) ||
          patient?.firstName.toLowerCase().includes(term) ||
          patient?.lastName.toLowerCase().includes(term) ||
          patient?.memberNumber.toLowerCase().includes(term) ||
          scheme?.name.toLowerCase().includes(term)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortField) {
        case "claimNumber":
          aVal = a.claimNumber;
          bVal = b.claimNumber;
          break;
        case "dateCreated":
          aVal = new Date(a.dateCreated).getTime();
          bVal = new Date(b.dateCreated).getTime();
          break;
        case "totalBilled":
          aVal = a.totalBilled;
          bVal = b.totalBilled;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.dateCreated).getTime();
          bVal = new Date(b.dateCreated).getTime();
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [claims, statusFilter, schemeFilter, searchTerm, sortField, sortDirection, patients, schemes]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search claims, patients, members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={schemeFilter} onValueChange={setSchemeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by scheme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schemes</SelectItem>
            {schemes.map((scheme) => (
              <SelectItem key={scheme.id} value={scheme.id}>
                {scheme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {filteredClaims.length} claim{filteredClaims.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("claimNumber")}
              >
                Claim #
                {sortField === "claimNumber" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Scheme</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("dateCreated")}
              >
                Date
                {sortField === "dateCreated" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted text-right"
                onClick={() => handleSort("totalBilled")}
              >
                Billed
                {sortField === "totalBilled" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted"
                onClick={() => handleSort("status")}
              >
                Status
                {sortField === "status" && (
                  <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              {showActions && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClaims.map((claim) => {
              const patient = getPatient(claim.patientId);
              const scheme = getScheme(claim.schemeId);
              const provider = getProvider(claim.providerId);

              return (
                <TableRow key={claim.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm font-medium">
                    <Link href={`/claims/${claim.id}`} className="text-primary hover:underline">
                      {claim.claimNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {patient?.firstName} {patient?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {patient?.memberNumber}-{patient?.dependantCode}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{scheme?.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{provider?.name}</span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(claim.dateOfService)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(claim.totalBilled)}
                  </TableCell>
                  <TableCell>
                    <ClaimStatusBadge status={claim.status} />
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/claims/${claim.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {(claim.status === "ready" || claim.status === "closed") && (
                            <DropdownMenuItem onClick={() => validateClaim(claim.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Validate
                            </DropdownMenuItem>
                          )}
                          {claim.status === "validated" && (
                            <DropdownMenuItem onClick={() => submitClaim(claim.id)}>
                              <Send className="h-4 w-4 mr-2" />
                              Submit
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <X className="h-4 w-4 mr-2" />
                            Cancel Claim
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {filteredClaims.length === 0 && (
              <TableRow>
                <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No claims found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
