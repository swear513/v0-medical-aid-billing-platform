// =============================================================================
// SA Medical Aid Billing Platform - Core Types
// =============================================================================

// -----------------------------------------------------------------------------
// Enums
// -----------------------------------------------------------------------------

export type ClaimStatus =
  | "draft"
  | "ready"
  | "closed"
  | "validating"
  | "validated"
  | "validation_failed"
  | "submitted"
  | "acknowledged"
  | "accepted"
  | "rejected"
  | "partial"
  | "paid"
  | "reconciled"
  | "appealed"
  | "written_off";

export type UserRole =
  | "administrator"
  | "billing_specialist"
  | "healthcare_provider"
  | "finance_officer"
  | "compliance_auditor";

export type RuleSeverity = "error" | "warning" | "info";

export type RuleCategory =
  | "patient_eligibility"
  | "coding_accuracy"
  | "clinical_appropriateness"
  | "pricing_compliance"
  | "documentation"
  | "duplicate_detection"
  | "authorization";

export type SchemeType = "open" | "restricted" | "closed";

export type BenefitType = "in_hospital" | "out_of_hospital" | "chronic" | "day_to_day" | "pmb";

export type AuditAction =
  | "claim_created"
  | "claim_updated"
  | "claim_closed"
  | "validation_run"
  | "claim_submitted"
  | "response_received"
  | "payment_posted"
  | "reconciliation_completed"
  | "rule_executed"
  | "user_action";

// -----------------------------------------------------------------------------
// Core Entities
// -----------------------------------------------------------------------------

export interface Patient {
  id: string;
  memberNumber: string;
  dependantCode: string;
  title: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  schemeId: string;
  planId: string;
  effectiveDate: string;
  terminationDate?: string;
  isActive: boolean;
}

export interface MedicalScheme {
  id: string;
  name: string;
  registrationNumber: string;
  type: SchemeType;
  contactEmail: string;
  contactPhone: string;
  submissionEndpoint?: string;
  isActive: boolean;
}

export interface BenefitPlan {
  id: string;
  schemeId: string;
  name: string;
  code: string;
  benefitType: BenefitType;
  annualLimit?: number;
  usedAmount: number;
  remainingAmount?: number;
  isActive: boolean;
}

export interface Provider {
  id: string;
  practiceNumber: string;
  hpcsaNumber: string;
  name: string;
  specialty: string;
  facilityName?: string;
  facilityCode?: string;
  isActive: boolean;
}

// -----------------------------------------------------------------------------
// Claim & Line Items
// -----------------------------------------------------------------------------

export interface ClaimLineItem {
  id: string;
  lineNumber: number;
  tariffCode: string;
  nappiCode?: string;
  icd10Codes: string[];
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  dateOfService: string;
  modifiers?: string[];
  authorizationNumber?: string;
  notes?: string;
}

export interface Claim {
  id: string;
  claimNumber: string;
  status: ClaimStatus;
  patientId: string;
  providerId: string;
  schemeId: string;
  planId: string;

  // Dates
  dateOfService: string;
  dateCreated: string;
  dateClosed?: string;
  dateSubmitted?: string;
  dateResponse?: string;
  datePaid?: string;
  dateReconciled?: string;

  // Line items
  lineItems: ClaimLineItem[];

  // Financials
  totalBilled: number;
  totalApproved?: number;
  totalPaid?: number;
  patientLiability?: number;
  adjustmentAmount?: number;

  // References
  schemeClaimNumber?: string;
  authorizationNumber?: string;
  referralNumber?: string;

  // Validation
  validationResults?: ValidationResult[];
  lastValidatedAt?: string;

  // Response
  responseCode?: string;
  responseMessage?: string;
  rejectionReasons?: RejectionReason[];

  // Metadata
  createdBy: string;
  updatedBy?: string;
  notes?: string;
}

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  category: RuleCategory;
  severity: RuleSeverity;
  passed: boolean;
  message: string;
  lineItemId?: string;
  suggestion?: string;
  timestamp: string;
}

export interface RejectionReason {
  code: string;
  description: string;
  lineItemId?: string;
  appealable: boolean;
}

// -----------------------------------------------------------------------------
// Rules Engine
// -----------------------------------------------------------------------------

export interface Rule {
  id: string;
  code: string;
  name: string;
  description: string;
  category: RuleCategory;
  severity: RuleSeverity;
  isActive: boolean;
  version: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RuleCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "not_contains" | "greater_than" | "less_than" | "in" | "not_in" | "exists" | "not_exists" | "regex";
  value: string | number | boolean | string[];
  logicalOperator?: "AND" | "OR";
}

export interface RuleAction {
  type: "reject" | "warn" | "flag" | "auto_correct" | "require_review";
  message: string;
  suggestion?: string;
}

export interface DecisionBundle {
  id: string;
  name: string;
  description: string;
  ruleIds: string[];
  schemeIds?: string[];
  isDefault: boolean;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt?: string;
}

export interface RuleExecutionLog {
  id: string;
  claimId: string;
  ruleId: string;
  bundleId: string;
  executedAt: string;
  passed: boolean;
  message: string;
  executionTimeMs: number;
  inputSnapshot: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Billing & Remittance
// -----------------------------------------------------------------------------

export interface RemittanceAdvice {
  id: string;
  raNumber: string;
  schemeId: string;
  receivedDate: string;
  paymentDate: string;
  totalAmount: number;
  claimCount: number;
  status: "pending" | "processing" | "reconciled" | "disputed";
  lineItems: RemittanceLineItem[];
}

export interface RemittanceLineItem {
  id: string;
  claimId: string;
  claimNumber: string;
  billedAmount: number;
  approvedAmount: number;
  paidAmount: number;
  adjustmentAmount: number;
  adjustmentReasons: string[];
  patientLiability: number;
  isMatched: boolean;
  discrepancyAmount?: number;
  discrepancyReason?: string;
}

export interface ReconciliationRecord {
  id: string;
  claimId: string;
  remittanceId: string;
  status: "matched" | "partial_match" | "unmatched" | "disputed";
  billedAmount: number;
  expectedAmount: number;
  receivedAmount: number;
  variance: number;
  variancePercentage: number;
  reconciledAt: string;
  reconciledBy: string;
  notes?: string;
}

// -----------------------------------------------------------------------------
// Audit & Logging
// -----------------------------------------------------------------------------

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: AuditAction;
  entityType: "claim" | "rule" | "bundle" | "patient" | "provider" | "remittance" | "reconciliation" | "system";
  entityId: string;
  userId: string;
  userRole: UserRole;
  description: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// User & Session
// -----------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Session {
  user: User;
  isAuthenticated: boolean;
}

// -----------------------------------------------------------------------------
// Demo Scenario
// -----------------------------------------------------------------------------

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  category: "success" | "validation_failure" | "rejection" | "partial" | "edge_case";
  claimId: string;
}

// -----------------------------------------------------------------------------
// Dashboard Stats
// -----------------------------------------------------------------------------

export interface DashboardStats {
  totalClaims: number;
  claimsByStatus: Record<ClaimStatus, number>;
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  avgProcessingTime: number;
  validationPassRate: number;
  rejectionRate: number;
  recentActivity: AuditLogEntry[];
}

// -----------------------------------------------------------------------------
// API Response Types
// -----------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// -----------------------------------------------------------------------------
// Filter & Sort Types
// -----------------------------------------------------------------------------

export interface ClaimFilters {
  status?: ClaimStatus[];
  schemeId?: string;
  providerId?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}
