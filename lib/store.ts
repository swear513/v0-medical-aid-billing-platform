// =============================================================================
// SA Medical Aid Billing Platform - Zustand Store
// =============================================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Claim,
  ClaimStatus,
  ClaimFilters,
  Patient,
  Provider,
  MedicalScheme,
  BenefitPlan,
  Rule,
  DecisionBundle,
  RemittanceAdvice,
  ReconciliationRecord,
  AuditLogEntry,
  User,
  UserRole,
  ValidationResult,
  DemoScenario,
  AuditAction,
} from "./types";
import {
  demoClaims,
  demoPatients,
  demoProviders,
  demoSchemes,
  demoPlans,
  demoRules,
  demoBundles,
  demoRemittances,
  demoReconciliations,
  demoAuditLogs,
  demoUsers,
  demoScenarios,
} from "./demo-data";

// -----------------------------------------------------------------------------
// Store Types
// -----------------------------------------------------------------------------

interface AppState {
  // Session & User
  currentUser: User | null;
  currentRole: UserRole;
  isInitialized: boolean;

  // Core Data
  claims: Claim[];
  patients: Patient[];
  providers: Provider[];
  schemes: MedicalScheme[];
  plans: BenefitPlan[];
  rules: Rule[];
  bundles: DecisionBundle[];
  remittances: RemittanceAdvice[];
  reconciliations: ReconciliationRecord[];
  auditLogs: AuditLogEntry[];
  users: User[];
  scenarios: DemoScenario[];

  // UI State
  selectedClaimId: string | null;
  claimFilters: ClaimFilters;
  sidebarOpen: boolean;

  // Actions - Session
  setCurrentRole: (role: UserRole) => void;
  initialize: () => void;
  resetToDemo: () => void;

  // Actions - Claims
  getClaim: (id: string) => Claim | undefined;
  getClaimsByStatus: (status: ClaimStatus | ClaimStatus[]) => Claim[];
  createClaim: (claim: Omit<Claim, "id" | "claimNumber" | "dateCreated">) => Claim;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  closeClaim: (id: string) => void;
  validateClaim: (id: string, bundleId?: string) => ValidationResult[];
  submitClaim: (id: string) => void;
  setSelectedClaim: (id: string | null) => void;
  setClaimFilters: (filters: ClaimFilters) => void;

  // Actions - Rules Engine
  getRule: (id: string) => Rule | undefined;
  getActiveRules: () => Rule[];
  createRule: (rule: Omit<Rule, "id" | "createdAt">) => Rule;
  updateRule: (id: string, updates: Partial<Rule>) => void;
  toggleRule: (id: string) => void;
  getBundle: (id: string) => DecisionBundle | undefined;
  createBundle: (bundle: Omit<DecisionBundle, "id" | "createdAt">) => DecisionBundle;
  updateBundle: (id: string, updates: Partial<DecisionBundle>) => void;

  // Actions - Remittance & Reconciliation
  getRemittance: (id: string) => RemittanceAdvice | undefined;
  processRemittance: (remittance: Omit<RemittanceAdvice, "id">) => RemittanceAdvice;
  reconcileClaim: (claimId: string, remittanceId: string, receivedAmount: number, notes?: string) => ReconciliationRecord;

  // Actions - Lookup
  getPatient: (id: string) => Patient | undefined;
  getProvider: (id: string) => Provider | undefined;
  getScheme: (id: string) => MedicalScheme | undefined;
  getPlan: (id: string) => BenefitPlan | undefined;

  // Actions - Audit
  addAuditLog: (entry: Omit<AuditLogEntry, "id" | "timestamp">) => void;
  getAuditLogsForEntity: (entityType: string, entityId: string) => AuditLogEntry[];

  // Actions - UI
  setSidebarOpen: (open: boolean) => void;

  // Actions - Stats
  getDashboardStats: () => {
    totalClaims: number;
    claimsByStatus: Record<string, number>;
    totalBilled: number;
    totalPaid: number;
    totalOutstanding: number;
    validationPassRate: number;
    rejectionRate: number;
  };
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const generateClaimNumber = (claims: Claim[]) => {
  const year = new Date().getFullYear();
  const count = claims.filter((c) => c.claimNumber.includes(year.toString())).length + 1;
  return `CLM-${year}-${count.toString().padStart(5, "0")}`;
};

// -----------------------------------------------------------------------------
// Store Implementation
// -----------------------------------------------------------------------------

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      currentRole: "billing_specialist",
      isInitialized: false,

      claims: [],
      patients: [],
      providers: [],
      schemes: [],
      plans: [],
      rules: [],
      bundles: [],
      remittances: [],
      reconciliations: [],
      auditLogs: [],
      users: [],
      scenarios: [],

      selectedClaimId: null,
      claimFilters: {},
      sidebarOpen: true,

      // Session Actions
      setCurrentRole: (role) => {
        const users = get().users;
        const user = users.find((u) => u.role === role) || users[0];
        set({ currentRole: role, currentUser: user });
      },

      initialize: () => {
        const state = get();
        if (!state.isInitialized || state.claims.length === 0) {
          set({
            claims: demoClaims,
            patients: demoPatients,
            providers: demoProviders,
            schemes: demoSchemes,
            plans: demoPlans,
            rules: demoRules,
            bundles: demoBundles,
            remittances: demoRemittances,
            reconciliations: demoReconciliations,
            auditLogs: demoAuditLogs,
            users: demoUsers,
            scenarios: demoScenarios,
            currentUser: demoUsers[1], // Billing Specialist by default
            currentRole: "billing_specialist",
            isInitialized: true,
          });
        }
      },

      resetToDemo: () => {
        set({
          claims: demoClaims,
          patients: demoPatients,
          providers: demoProviders,
          schemes: demoSchemes,
          plans: demoPlans,
          rules: demoRules,
          bundles: demoBundles,
          remittances: demoRemittances,
          reconciliations: demoReconciliations,
          auditLogs: demoAuditLogs,
          users: demoUsers,
          scenarios: demoScenarios,
          currentUser: demoUsers[1],
          currentRole: "billing_specialist",
          isInitialized: true,
        });
      },

      // Claim Actions
      getClaim: (id) => get().claims.find((c) => c.id === id),

      getClaimsByStatus: (status) => {
        const statuses = Array.isArray(status) ? status : [status];
        return get().claims.filter((c) => statuses.includes(c.status));
      },

      createClaim: (claimData) => {
        const claims = get().claims;
        const newClaim: Claim = {
          ...claimData,
          id: generateId("claim"),
          claimNumber: generateClaimNumber(claims),
          dateCreated: new Date().toISOString(),
          status: "draft",
        };
        set({ claims: [...claims, newClaim] });
        get().addAuditLog({
          action: "claim_created",
          entityType: "claim",
          entityId: newClaim.id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: `New claim ${newClaim.claimNumber} created`,
        });
        return newClaim;
      },

      updateClaim: (id, updates) => {
        set({
          claims: get().claims.map((c) =>
            c.id === id ? { ...c, ...updates, updatedBy: get().currentUser?.id } : c
          ),
        });
        get().addAuditLog({
          action: "claim_updated",
          entityType: "claim",
          entityId: id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: `Claim updated`,
          newValue: updates as Record<string, unknown>,
        });
      },

      closeClaim: (id) => {
        const claim = get().getClaim(id);
        if (!claim || claim.status !== "draft") return;
        
        set({
          claims: get().claims.map((c) =>
            c.id === id
              ? { ...c, status: "ready" as ClaimStatus, dateClosed: new Date().toISOString() }
              : c
          ),
        });
        get().addAuditLog({
          action: "claim_closed",
          entityType: "claim",
          entityId: id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: `Claim ${claim.claimNumber} closed and ready for validation`,
        });
      },

      validateClaim: (id, bundleId) => {
        const claim = get().getClaim(id);
        if (!claim) return [];

        const bundle = bundleId
          ? get().getBundle(bundleId)
          : get().bundles.find((b) => b.isDefault);
        
        if (!bundle) return [];

        const rules = bundle.ruleIds
          .map((rId) => get().getRule(rId))
          .filter((r): r is Rule => r !== undefined && r.isActive);

        const patient = get().getPatient(claim.patientId);
        const results: ValidationResult[] = [];

        // Execute rules
        for (const rule of rules) {
          for (const lineItem of claim.lineItems) {
            let passed = true;
            let message = "";

            // Simplified rule execution based on rule code
            switch (rule.code) {
              case "ICD10-001":
                passed = lineItem.icd10Codes.length > 0;
                message = passed
                  ? "Valid ICD-10 code present"
                  : `Line item ${lineItem.lineNumber} is missing ICD-10 code`;
                break;
              case "TARIFF-001":
                passed = /^[0-9]{4}$/.test(lineItem.tariffCode);
                message = passed
                  ? "Valid tariff code"
                  : `Invalid tariff code format: ${lineItem.tariffCode}`;
                break;
              case "ELIG-001":
                passed = patient?.isActive ?? false;
                message = passed
                  ? "Member has active coverage"
                  : `Member coverage terminated${patient?.terminationDate ? ` on ${patient.terminationDate}` : ""}`;
                break;
              case "DUP-001":
                const duplicates = get().claims.filter(
                  (c) =>
                    c.id !== claim.id &&
                    c.patientId === claim.patientId &&
                    c.providerId === claim.providerId &&
                    c.dateOfService === claim.dateOfService &&
                    c.status !== "draft" &&
                    c.lineItems.some((li) =>
                      lineItem.tariffCode === li.tariffCode
                    )
                );
                passed = duplicates.length === 0;
                message = passed
                  ? "No duplicate claims found"
                  : `Potential duplicate: Same patient, provider, date, and procedure as ${duplicates[0].claimNumber}`;
                break;
              case "AUTH-001":
                const authRequired = ["1212", "1520", "1550", "2751", "3859"].includes(lineItem.tariffCode);
                passed = !authRequired || !!claim.authorizationNumber;
                message = passed
                  ? "Authorization verified or not required"
                  : "Procedure requires pre-authorization";
                break;
              default:
                passed = true;
                message = "Rule check passed";
            }

            if (!passed || rule.severity !== "error") {
              results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                category: rule.category,
                severity: rule.severity,
                passed,
                message,
                lineItemId: lineItem.id,
                suggestion: !passed ? rule.actions[0]?.suggestion : undefined,
                timestamp: new Date().toISOString(),
              });
            }
          }
        }

        // Determine overall validation status
        const hasErrors = results.some((r) => !r.passed && r.severity === "error");
        const newStatus: ClaimStatus = hasErrors ? "validation_failed" : "validated";

        set({
          claims: get().claims.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: newStatus,
                  validationResults: results,
                  lastValidatedAt: new Date().toISOString(),
                }
              : c
          ),
        });

        get().addAuditLog({
          action: "validation_run",
          entityType: "claim",
          entityId: id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: hasErrors
            ? `Validation failed for ${claim.claimNumber} - ${results.filter((r) => !r.passed).length} issue(s) found`
            : `Validation passed for ${claim.claimNumber}`,
        });

        return results;
      },

      submitClaim: (id) => {
        const claim = get().getClaim(id);
        if (!claim || !["validated", "ready"].includes(claim.status)) return;

        const scheme = get().getScheme(claim.schemeId);
        const schemeClaimNumber = `${scheme?.name?.substring(0, 2).toUpperCase() || "XX"}-${new Date().getFullYear()}-${Math.random().toString().substring(2, 8)}`;

        set({
          claims: get().claims.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status: "submitted" as ClaimStatus,
                  dateSubmitted: new Date().toISOString(),
                  schemeClaimNumber,
                }
              : c
          ),
        });

        get().addAuditLog({
          action: "claim_submitted",
          entityType: "claim",
          entityId: id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: `Claim ${claim.claimNumber} submitted to ${scheme?.name || "scheme"}`,
        });
      },

      setSelectedClaim: (id) => set({ selectedClaimId: id }),
      setClaimFilters: (filters) => set({ claimFilters: filters }),

      // Rules Engine Actions
      getRule: (id) => get().rules.find((r) => r.id === id),
      getActiveRules: () => get().rules.filter((r) => r.isActive),

      createRule: (ruleData) => {
        const newRule: Rule = {
          ...ruleData,
          id: generateId("rule"),
          createdAt: new Date().toISOString(),
        };
        set({ rules: [...get().rules, newRule] });
        return newRule;
      },

      updateRule: (id, updates) => {
        set({
          rules: get().rules.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        });
      },

      toggleRule: (id) => {
        const rule = get().getRule(id);
        if (rule) {
          get().updateRule(id, { isActive: !rule.isActive });
        }
      },

      getBundle: (id) => get().bundles.find((b) => b.id === id),

      createBundle: (bundleData) => {
        const newBundle: DecisionBundle = {
          ...bundleData,
          id: generateId("bundle"),
          createdAt: new Date().toISOString(),
        };
        set({ bundles: [...get().bundles, newBundle] });
        return newBundle;
      },

      updateBundle: (id, updates) => {
        set({
          bundles: get().bundles.map((b) =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
          ),
        });
      },

      // Remittance & Reconciliation
      getRemittance: (id) => get().remittances.find((r) => r.id === id),

      processRemittance: (remittanceData) => {
        const newRemittance: RemittanceAdvice = {
          ...remittanceData,
          id: generateId("ra"),
        };
        set({ remittances: [...get().remittances, newRemittance] });
        return newRemittance;
      },

      reconcileClaim: (claimId, remittanceId, receivedAmount, notes) => {
        const claim = get().getClaim(claimId);
        if (!claim) throw new Error("Claim not found");

        const variance = claim.totalBilled - receivedAmount;
        const variancePercentage = (variance / claim.totalBilled) * 100;

        const record: ReconciliationRecord = {
          id: generateId("recon"),
          claimId,
          remittanceId,
          status: variance === 0 ? "matched" : variance > 0 ? "partial_match" : "disputed",
          billedAmount: claim.totalBilled,
          expectedAmount: claim.totalApproved || claim.totalBilled,
          receivedAmount,
          variance,
          variancePercentage,
          reconciledAt: new Date().toISOString(),
          reconciledBy: get().currentUser?.id || "system",
          notes,
        };

        set({ reconciliations: [...get().reconciliations, record] });

        // Update claim status
        get().updateClaim(claimId, {
          status: "reconciled",
          dateReconciled: new Date().toISOString(),
          totalPaid: receivedAmount,
        });

        get().addAuditLog({
          action: "reconciliation_completed",
          entityType: "reconciliation",
          entityId: record.id,
          userId: get().currentUser?.id || "system",
          userRole: get().currentRole,
          description: `Reconciliation completed for ${claim.claimNumber}${variance !== 0 ? ` with R${Math.abs(variance).toFixed(2)} variance` : ""}`,
        });

        return record;
      },

      // Lookup Actions
      getPatient: (id) => get().patients.find((p) => p.id === id),
      getProvider: (id) => get().providers.find((p) => p.id === id),
      getScheme: (id) => get().schemes.find((s) => s.id === id),
      getPlan: (id) => get().plans.find((p) => p.id === id),

      // Audit Actions
      addAuditLog: (entry) => {
        const newEntry: AuditLogEntry = {
          ...entry,
          id: generateId("audit"),
          timestamp: new Date().toISOString(),
        };
        set({ auditLogs: [newEntry, ...get().auditLogs].slice(0, 1000) }); // Keep last 1000 entries
      },

      getAuditLogsForEntity: (entityType, entityId) =>
        get().auditLogs.filter(
          (log) => log.entityType === entityType && log.entityId === entityId
        ),

      // UI Actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Stats
      getDashboardStats: () => {
        const claims = get().claims;
        const claimsByStatus: Record<string, number> = {};
        
        for (const claim of claims) {
          claimsByStatus[claim.status] = (claimsByStatus[claim.status] || 0) + 1;
        }

        const totalBilled = claims.reduce((sum, c) => sum + c.totalBilled, 0);
        const totalPaid = claims.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
        
        const validatedClaims = claims.filter((c) =>
          ["validated", "submitted", "acknowledged", "accepted", "paid", "reconciled"].includes(c.status)
        );
        const rejectedClaims = claims.filter((c) => c.status === "rejected");

        return {
          totalClaims: claims.length,
          claimsByStatus,
          totalBilled,
          totalPaid,
          totalOutstanding: totalBilled - totalPaid,
          validationPassRate: claims.length > 0
            ? (validatedClaims.length / claims.length) * 100
            : 0,
          rejectionRate: claims.length > 0
            ? (rejectedClaims.length / claims.length) * 100
            : 0,
        };
      },
    }),
    {
      name: "sa-medical-billing-store",
      partialize: (state) => ({
        claims: state.claims,
        patients: state.patients,
        providers: state.providers,
        schemes: state.schemes,
        plans: state.plans,
        rules: state.rules,
        bundles: state.bundles,
        remittances: state.remittances,
        reconciliations: state.reconciliations,
        auditLogs: state.auditLogs,
        currentRole: state.currentRole,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
