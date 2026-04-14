// =============================================================================
// SA Medical Aid Billing Platform - Demo Data & Scenarios
// =============================================================================

import type {
  Patient,
  MedicalScheme,
  BenefitPlan,
  Provider,
  Claim,
  ClaimLineItem,
  Rule,
  DecisionBundle,
  RemittanceAdvice,
  ReconciliationRecord,
  AuditLogEntry,
  User,
  DemoScenario,
} from "./types";

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------

export const demoUsers: User[] = [
  {
    id: "user-001",
    email: "admin@medicalbilling.co.za",
    firstName: "Sipho",
    lastName: "Ndlovu",
    role: "administrator",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    email: "billing@medicalbilling.co.za",
    firstName: "Thandi",
    lastName: "Mokoena",
    role: "billing_specialist",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "user-003",
    email: "doctor@practice.co.za",
    firstName: "Dr. Johan",
    lastName: "van der Merwe",
    role: "healthcare_provider",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "user-004",
    email: "finance@medicalbilling.co.za",
    firstName: "Nomvula",
    lastName: "Khumalo",
    role: "finance_officer",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "user-005",
    email: "audit@medicalbilling.co.za",
    firstName: "Pieter",
    lastName: "Botha",
    role: "compliance_auditor",
    isActive: true,
    lastLoginAt: new Date().toISOString(),
    createdAt: "2024-03-01T00:00:00Z",
  },
];

// -----------------------------------------------------------------------------
// Medical Schemes
// -----------------------------------------------------------------------------

export const demoSchemes: MedicalScheme[] = [
  {
    id: "scheme-001",
    name: "Discovery Health",
    registrationNumber: "1125",
    type: "open",
    contactEmail: "claims@discovery.co.za",
    contactPhone: "0860 99 88 77",
    submissionEndpoint: "https://api.discovery.co.za/claims",
    isActive: true,
  },
  {
    id: "scheme-002",
    name: "Bonitas Medical Fund",
    registrationNumber: "1284",
    type: "open",
    contactEmail: "claims@bonitas.co.za",
    contactPhone: "0860 002 108",
    submissionEndpoint: "https://api.bonitas.co.za/claims",
    isActive: true,
  },
  {
    id: "scheme-003",
    name: "GEMS",
    registrationNumber: "1151",
    type: "restricted",
    contactEmail: "claims@gems.gov.za",
    contactPhone: "0860 004 367",
    submissionEndpoint: "https://api.gems.gov.za/claims",
    isActive: true,
  },
  {
    id: "scheme-004",
    name: "Medihelp",
    registrationNumber: "1099",
    type: "open",
    contactEmail: "claims@medihelp.co.za",
    contactPhone: "0860 100 678",
    isActive: true,
  },
  {
    id: "scheme-005",
    name: "Momentum Health",
    registrationNumber: "1178",
    type: "open",
    contactEmail: "claims@momentumhealth.co.za",
    contactPhone: "0860 117 859",
    isActive: true,
  },
];

// -----------------------------------------------------------------------------
// Benefit Plans
// -----------------------------------------------------------------------------

export const demoPlans: BenefitPlan[] = [
  {
    id: "plan-001",
    schemeId: "scheme-001",
    name: "Executive Plan",
    code: "EXEC",
    benefitType: "in_hospital",
    annualLimit: 500000,
    usedAmount: 125000,
    remainingAmount: 375000,
    isActive: true,
  },
  {
    id: "plan-002",
    schemeId: "scheme-001",
    name: "Classic Comprehensive",
    code: "CLSC",
    benefitType: "in_hospital",
    annualLimit: 250000,
    usedAmount: 50000,
    remainingAmount: 200000,
    isActive: true,
  },
  {
    id: "plan-003",
    schemeId: "scheme-002",
    name: "BonCap",
    code: "BCAP",
    benefitType: "out_of_hospital",
    annualLimit: 150000,
    usedAmount: 75000,
    remainingAmount: 75000,
    isActive: true,
  },
  {
    id: "plan-004",
    schemeId: "scheme-003",
    name: "Emerald Value",
    code: "EMVL",
    benefitType: "chronic",
    annualLimit: 100000,
    usedAmount: 20000,
    remainingAmount: 80000,
    isActive: true,
  },
  {
    id: "plan-005",
    schemeId: "scheme-001",
    name: "KeyCare Plus",
    code: "KEYP",
    benefitType: "pmb",
    usedAmount: 0,
    isActive: true,
  },
];

// -----------------------------------------------------------------------------
// Patients
// -----------------------------------------------------------------------------

export const demoPatients: Patient[] = [
  {
    id: "patient-001",
    memberNumber: "1234567890",
    dependantCode: "00",
    title: "Mr",
    firstName: "Thabo",
    lastName: "Mbeki",
    idNumber: "8501015800089",
    dateOfBirth: "1985-01-01",
    gender: "male",
    schemeId: "scheme-001",
    planId: "plan-001",
    effectiveDate: "2023-01-01",
    isActive: true,
  },
  {
    id: "patient-002",
    memberNumber: "2345678901",
    dependantCode: "00",
    title: "Mrs",
    firstName: "Lindiwe",
    lastName: "Sisulu",
    idNumber: "9002145800082",
    dateOfBirth: "1990-02-14",
    gender: "female",
    schemeId: "scheme-002",
    planId: "plan-003",
    effectiveDate: "2022-06-01",
    isActive: true,
  },
  {
    id: "patient-003",
    memberNumber: "3456789012",
    dependantCode: "01",
    title: "Ms",
    firstName: "Nomzamo",
    lastName: "Zuma",
    idNumber: "7803205800086",
    dateOfBirth: "1978-03-20",
    gender: "female",
    schemeId: "scheme-003",
    planId: "plan-004",
    effectiveDate: "2021-01-01",
    isActive: true,
  },
  {
    id: "patient-004",
    memberNumber: "4567890123",
    dependantCode: "00",
    title: "Mr",
    firstName: "Cyril",
    lastName: "Mthembu",
    idNumber: "6506125800085",
    dateOfBirth: "1965-06-12",
    gender: "male",
    schemeId: "scheme-001",
    planId: "plan-002",
    effectiveDate: "2020-03-15",
    isActive: true,
  },
  {
    id: "patient-005",
    memberNumber: "5678901234",
    dependantCode: "00",
    title: "Dr",
    firstName: "Precious",
    lastName: "Moloi",
    idNumber: "8812305800083",
    dateOfBirth: "1988-12-30",
    gender: "female",
    schemeId: "scheme-001",
    planId: "plan-001",
    effectiveDate: "2024-01-01",
    isActive: true,
  },
  // Inactive patient for edge case testing
  {
    id: "patient-006",
    memberNumber: "6789012345",
    dependantCode: "00",
    title: "Mr",
    firstName: "Jacob",
    lastName: "Dlamini",
    idNumber: "5504015800088",
    dateOfBirth: "1955-04-01",
    gender: "male",
    schemeId: "scheme-004",
    planId: "plan-003",
    effectiveDate: "2018-01-01",
    terminationDate: "2024-06-30",
    isActive: false,
  },
];

// -----------------------------------------------------------------------------
// Providers
// -----------------------------------------------------------------------------

export const demoProviders: Provider[] = [
  {
    id: "provider-001",
    practiceNumber: "0123456",
    hpcsaNumber: "MP0123456",
    name: "Dr. Sarah van Niekerk",
    specialty: "General Practitioner",
    facilityName: "Sandton Medical Centre",
    facilityCode: "SMC001",
    isActive: true,
  },
  {
    id: "provider-002",
    practiceNumber: "0234567",
    hpcsaNumber: "MP0234567",
    name: "Dr. Mandla Ngcobo",
    specialty: "Orthopaedic Surgeon",
    facilityName: "Netcare Milpark Hospital",
    facilityCode: "NMP002",
    isActive: true,
  },
  {
    id: "provider-003",
    practiceNumber: "0345678",
    hpcsaNumber: "MP0345678",
    name: "Dr. Elizabeth Pretorius",
    specialty: "Cardiologist",
    facilityName: "Life Fourways Hospital",
    facilityCode: "LFW003",
    isActive: true,
  },
  {
    id: "provider-004",
    practiceNumber: "0456789",
    hpcsaNumber: "MP0456789",
    name: "Dr. Ahmed Patel",
    specialty: "Radiologist",
    facilityName: "Lancet Laboratories",
    facilityCode: "LLC004",
    isActive: true,
  },
];

// -----------------------------------------------------------------------------
// Demo Line Items (reusable)
// -----------------------------------------------------------------------------

const createLineItem = (
  id: string,
  lineNumber: number,
  tariffCode: string,
  description: string,
  quantity: number,
  unitPrice: number,
  icd10Codes: string[],
  dateOfService: string,
  nappiCode?: string
): ClaimLineItem => ({
  id,
  lineNumber,
  tariffCode,
  nappiCode,
  icd10Codes,
  description,
  quantity,
  unitPrice,
  totalPrice: quantity * unitPrice,
  dateOfService,
});

// -----------------------------------------------------------------------------
// Demo Claims (11 Scenarios)
// -----------------------------------------------------------------------------

const today = new Date();
const formatDate = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
};

export const demoClaims: Claim[] = [
  // Scenario 1: Clean Success - Full Payment
  {
    id: "claim-001",
    claimNumber: "CLM-2024-00001",
    status: "paid",
    patientId: "patient-001",
    providerId: "provider-001",
    schemeId: "scheme-001",
    planId: "plan-001",
    dateOfService: formatDate(30),
    dateCreated: formatDate(28),
    dateClosed: formatDate(27),
    dateSubmitted: formatDate(26),
    dateResponse: formatDate(20),
    datePaid: formatDate(15),
    dateReconciled: formatDate(10),
    lineItems: [
      createLineItem("li-001-1", 1, "0190", "Consultation - Level 3", 1, 650, ["J06.9"], formatDate(30)),
      createLineItem("li-001-2", 2, "0191", "Follow-up consultation", 1, 450, ["J06.9"], formatDate(30)),
    ],
    totalBilled: 1100,
    totalApproved: 1100,
    totalPaid: 1100,
    patientLiability: 0,
    schemeClaimNumber: "DH-2024-123456",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "All line items have valid ICD-10 codes", timestamp: formatDate(27) },
      { ruleId: "rule-002", ruleName: "Tariff Code Valid", category: "pricing_compliance", severity: "error", passed: true, message: "All tariff codes are valid", timestamp: formatDate(27) },
    ],
    lastValidatedAt: formatDate(27),
    createdBy: "user-002",
    notes: "Routine consultation - clean claim",
  },

  // Scenario 2: Missing ICD-10 Code
  {
    id: "claim-002",
    claimNumber: "CLM-2024-00002",
    status: "validation_failed",
    patientId: "patient-002",
    providerId: "provider-001",
    schemeId: "scheme-002",
    planId: "plan-003",
    dateOfService: formatDate(5),
    dateCreated: formatDate(4),
    lineItems: [
      createLineItem("li-002-1", 1, "0190", "Consultation - Level 3", 1, 650, [], formatDate(5)), // Missing ICD-10
      createLineItem("li-002-2", 2, "0141", "ECG", 1, 350, [], formatDate(5)), // Missing ICD-10
    ],
    totalBilled: 1000,
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: false, message: "Line item 1 is missing ICD-10 code", lineItemId: "li-002-1", suggestion: "Add appropriate ICD-10 diagnosis code", timestamp: formatDate(3) },
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: false, message: "Line item 2 is missing ICD-10 code", lineItemId: "li-002-2", suggestion: "Add appropriate ICD-10 diagnosis code", timestamp: formatDate(3) },
    ],
    lastValidatedAt: formatDate(3),
    createdBy: "user-002",
    notes: "Needs ICD-10 codes added before submission",
  },

  // Scenario 3: Scheme Rejection
  {
    id: "claim-003",
    claimNumber: "CLM-2024-00003",
    status: "rejected",
    patientId: "patient-003",
    providerId: "provider-002",
    schemeId: "scheme-003",
    planId: "plan-004",
    dateOfService: formatDate(45),
    dateCreated: formatDate(43),
    dateClosed: formatDate(42),
    dateSubmitted: formatDate(41),
    dateResponse: formatDate(35),
    lineItems: [
      createLineItem("li-003-1", 1, "1550", "Knee Arthroscopy", 1, 15000, ["M23.50"], formatDate(45)),
    ],
    totalBilled: 15000,
    totalApproved: 0,
    totalPaid: 0,
    schemeClaimNumber: "GE-2024-789012",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "Valid ICD-10 code present", timestamp: formatDate(42) },
      { ruleId: "rule-005", ruleName: "Pre-authorization Required", category: "authorization", severity: "warning", passed: false, message: "Procedure requires pre-authorization", suggestion: "Obtain authorization before submission", timestamp: formatDate(42) },
    ],
    lastValidatedAt: formatDate(42),
    responseCode: "REJ-AUTH",
    responseMessage: "Claim rejected - No pre-authorization on file",
    rejectionReasons: [
      { code: "PA001", description: "Pre-authorization not obtained for elective surgical procedure", appealable: true },
    ],
    createdBy: "user-002",
    notes: "Auth not obtained - patient to appeal",
  },

  // Scenario 4: Partial Payment
  {
    id: "claim-004",
    claimNumber: "CLM-2024-00004",
    status: "partial",
    patientId: "patient-004",
    providerId: "provider-003",
    schemeId: "scheme-001",
    planId: "plan-002",
    dateOfService: formatDate(25),
    dateCreated: formatDate(23),
    dateClosed: formatDate(22),
    dateSubmitted: formatDate(21),
    dateResponse: formatDate(15),
    datePaid: formatDate(10),
    lineItems: [
      createLineItem("li-004-1", 1, "0192", "Extended Consultation", 1, 950, ["I10", "E11.9"], formatDate(25)),
      createLineItem("li-004-2", 2, "0141", "ECG", 1, 350, ["I10"], formatDate(25)),
      createLineItem("li-004-3", 3, "2751", "Echocardiogram", 1, 2500, ["I10"], formatDate(25)),
    ],
    totalBilled: 3800,
    totalApproved: 3200,
    totalPaid: 3200,
    patientLiability: 600,
    adjustmentAmount: 600,
    schemeClaimNumber: "DH-2024-345678",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "All line items have valid ICD-10 codes", timestamp: formatDate(22) },
      { ruleId: "rule-003", ruleName: "Scheme Rate Check", category: "pricing_compliance", severity: "warning", passed: false, message: "Consultation fee exceeds scheme rate", lineItemId: "li-004-1", timestamp: formatDate(22) },
    ],
    lastValidatedAt: formatDate(22),
    responseCode: "PART-PAY",
    responseMessage: "Partial payment - consultation rate adjusted to scheme maximum",
    createdBy: "user-002",
    notes: "Patient responsible for R600 co-payment",
  },

  // Scenario 5: Duplicate Claim Detection
  {
    id: "claim-005",
    claimNumber: "CLM-2024-00005",
    status: "validation_failed",
    patientId: "patient-001",
    providerId: "provider-001",
    schemeId: "scheme-001",
    planId: "plan-001",
    dateOfService: formatDate(30),
    dateCreated: formatDate(2),
    lineItems: [
      createLineItem("li-005-1", 1, "0190", "Consultation - Level 3", 1, 650, ["J06.9"], formatDate(30)),
    ],
    totalBilled: 650,
    validationResults: [
      { ruleId: "rule-006", ruleName: "Duplicate Detection", category: "duplicate_detection", severity: "error", passed: false, message: "Potential duplicate: Same patient, provider, date, and procedure as CLM-2024-00001", suggestion: "Review claim CLM-2024-00001 - already paid", timestamp: formatDate(2) },
    ],
    lastValidatedAt: formatDate(2),
    createdBy: "user-002",
    notes: "Flagged as potential duplicate",
  },

  // Scenario 6: Benefit Exhausted
  {
    id: "claim-006",
    claimNumber: "CLM-2024-00006",
    status: "rejected",
    patientId: "patient-002",
    providerId: "provider-001",
    schemeId: "scheme-002",
    planId: "plan-003",
    dateOfService: formatDate(20),
    dateCreated: formatDate(18),
    dateClosed: formatDate(17),
    dateSubmitted: formatDate(16),
    dateResponse: formatDate(12),
    lineItems: [
      createLineItem("li-006-1", 1, "0190", "Consultation - Level 3", 1, 650, ["M54.5"], formatDate(20)),
      createLineItem("li-006-2", 2, "3612", "Physiotherapy session", 1, 550, ["M54.5"], formatDate(20)),
    ],
    totalBilled: 1200,
    totalApproved: 0,
    totalPaid: 0,
    schemeClaimNumber: "BN-2024-456789",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "Valid ICD-10 codes present", timestamp: formatDate(17) },
      { ruleId: "rule-004", ruleName: "Benefit Limit Check", category: "patient_eligibility", severity: "warning", passed: false, message: "Patient approaching benefit limit", timestamp: formatDate(17) },
    ],
    lastValidatedAt: formatDate(17),
    responseCode: "REJ-BEN",
    responseMessage: "Claim rejected - Day-to-day benefits exhausted",
    rejectionReasons: [
      { code: "BEN001", description: "Annual out-of-hospital benefits exhausted for current benefit year", appealable: false },
    ],
    createdBy: "user-002",
    notes: "Patient to pay out of pocket",
  },

  // Scenario 7: PMB Condition
  {
    id: "claim-007",
    claimNumber: "CLM-2024-00007",
    status: "paid",
    patientId: "patient-005",
    providerId: "provider-003",
    schemeId: "scheme-001",
    planId: "plan-005",
    dateOfService: formatDate(40),
    dateCreated: formatDate(38),
    dateClosed: formatDate(37),
    dateSubmitted: formatDate(36),
    dateResponse: formatDate(30),
    datePaid: formatDate(25),
    lineItems: [
      createLineItem("li-007-1", 1, "0192", "Extended Consultation", 1, 950, ["I21.0"], formatDate(40)),
      createLineItem("li-007-2", 2, "0141", "ECG", 1, 350, ["I21.0"], formatDate(40)),
      createLineItem("li-007-3", 3, "3859", "Cardiac Catheterization", 1, 25000, ["I21.0"], formatDate(40)),
    ],
    totalBilled: 26300,
    totalApproved: 26300,
    totalPaid: 26300,
    patientLiability: 0,
    schemeClaimNumber: "DH-2024-567890",
    authorizationNumber: "AUTH-2024-PMB-001",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "Valid ICD-10 codes present", timestamp: formatDate(37) },
      { ruleId: "rule-007", ruleName: "PMB Condition Check", category: "clinical_appropriateness", severity: "info", passed: true, message: "Acute Myocardial Infarction is a PMB condition - full cover applies", timestamp: formatDate(37) },
    ],
    lastValidatedAt: formatDate(37),
    createdBy: "user-002",
    notes: "PMB condition - full cover mandatory",
  },

  // Scenario 8: Draft Claim (Ready for Closure)
  {
    id: "claim-008",
    claimNumber: "CLM-2024-00008",
    status: "draft",
    patientId: "patient-004",
    providerId: "provider-001",
    schemeId: "scheme-001",
    planId: "plan-002",
    dateOfService: formatDate(1),
    dateCreated: formatDate(1),
    lineItems: [
      createLineItem("li-008-1", 1, "0190", "Consultation - Level 3", 1, 650, ["R10.4"], formatDate(1)),
    ],
    totalBilled: 650,
    createdBy: "user-003",
    notes: "New consultation - pending line item completion",
  },

  // Scenario 9: Submitted - Awaiting Response
  {
    id: "claim-009",
    claimNumber: "CLM-2024-00009",
    status: "submitted",
    patientId: "patient-001",
    providerId: "provider-002",
    schemeId: "scheme-001",
    planId: "plan-001",
    dateOfService: formatDate(8),
    dateCreated: formatDate(7),
    dateClosed: formatDate(6),
    dateSubmitted: formatDate(5),
    lineItems: [
      createLineItem("li-009-1", 1, "1520", "MRI - Knee", 1, 5500, ["M23.20"], formatDate(8)),
    ],
    totalBilled: 5500,
    schemeClaimNumber: "DH-2024-678901",
    authorizationNumber: "AUTH-2024-MRI-002",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "Valid ICD-10 code present", timestamp: formatDate(6) },
      { ruleId: "rule-002", ruleName: "Tariff Code Valid", category: "pricing_compliance", severity: "error", passed: true, message: "Tariff code valid", timestamp: formatDate(6) },
      { ruleId: "rule-005", ruleName: "Pre-authorization Required", category: "authorization", severity: "warning", passed: true, message: "Authorization verified", timestamp: formatDate(6) },
    ],
    lastValidatedAt: formatDate(6),
    createdBy: "user-002",
    notes: "Awaiting scheme response",
  },

  // Scenario 10: Appealed Claim
  {
    id: "claim-010",
    claimNumber: "CLM-2024-00010",
    status: "appealed",
    patientId: "patient-003",
    providerId: "provider-002",
    schemeId: "scheme-003",
    planId: "plan-004",
    dateOfService: formatDate(60),
    dateCreated: formatDate(58),
    dateClosed: formatDate(57),
    dateSubmitted: formatDate(56),
    dateResponse: formatDate(50),
    lineItems: [
      createLineItem("li-010-1", 1, "1212", "Rotator Cuff Repair", 1, 35000, ["M75.10"], formatDate(60)),
    ],
    totalBilled: 35000,
    totalApproved: 0,
    schemeClaimNumber: "GE-2024-890123",
    authorizationNumber: "AUTH-2024-ORT-003",
    validationResults: [
      { ruleId: "rule-001", ruleName: "ICD-10 Presence", category: "coding_accuracy", severity: "error", passed: true, message: "Valid ICD-10 code present", timestamp: formatDate(57) },
    ],
    lastValidatedAt: formatDate(57),
    responseCode: "REJ-CLIN",
    responseMessage: "Claim rejected - Conservative treatment not exhausted",
    rejectionReasons: [
      { code: "CLIN001", description: "Clinical notes do not demonstrate failure of conservative treatment options", appealable: true },
    ],
    createdBy: "user-002",
    notes: "Appeal submitted with additional clinical notes",
  },

  // Scenario 11: Inactive Member
  {
    id: "claim-011",
    claimNumber: "CLM-2024-00011",
    status: "validation_failed",
    patientId: "patient-006",
    providerId: "provider-001",
    schemeId: "scheme-004",
    planId: "plan-003",
    dateOfService: formatDate(3),
    dateCreated: formatDate(2),
    lineItems: [
      createLineItem("li-011-1", 1, "0190", "Consultation - Level 3", 1, 650, ["J06.9"], formatDate(3)),
    ],
    totalBilled: 650,
    validationResults: [
      { ruleId: "rule-008", ruleName: "Member Eligibility", category: "patient_eligibility", severity: "error", passed: false, message: "Member coverage terminated on 2024-06-30", suggestion: "Verify member status or collect private payment", timestamp: formatDate(2) },
    ],
    lastValidatedAt: formatDate(2),
    createdBy: "user-002",
    notes: "Member coverage lapsed",
  },
];

// -----------------------------------------------------------------------------
// Rules
// -----------------------------------------------------------------------------

export const demoRules: Rule[] = [
  {
    id: "rule-001",
    code: "ICD10-001",
    name: "ICD-10 Presence Check",
    description: "Ensures all claim line items have at least one valid ICD-10 diagnosis code",
    category: "coding_accuracy",
    severity: "error",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.icd10Codes", operator: "exists", value: true },
      { field: "lineItem.icd10Codes.length", operator: "greater_than", value: 0 },
    ],
    actions: [
      { type: "reject", message: "Line item is missing ICD-10 diagnosis code", suggestion: "Add appropriate ICD-10 code from the diagnosis list" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-002",
    code: "TARIFF-001",
    name: "Tariff Code Validation",
    description: "Validates that tariff codes are recognized and active in the system",
    category: "pricing_compliance",
    severity: "error",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.tariffCode", operator: "exists", value: true },
      { field: "lineItem.tariffCode", operator: "regex", value: "^[0-9]{4}$" },
    ],
    actions: [
      { type: "reject", message: "Invalid or unrecognized tariff code", suggestion: "Verify tariff code against current SAMA codes" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-003",
    code: "RATE-001",
    name: "Scheme Rate Compliance",
    description: "Checks if billed amounts align with scheme-specific tariff rates",
    category: "pricing_compliance",
    severity: "warning",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.unitPrice", operator: "greater_than", value: 0 },
    ],
    actions: [
      { type: "warn", message: "Billed amount may exceed scheme maximum rate", suggestion: "Review scheme rate schedule for potential adjustments" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-004",
    code: "BEN-001",
    name: "Benefit Limit Check",
    description: "Warns when patient is approaching or has exceeded benefit limits",
    category: "patient_eligibility",
    severity: "warning",
    isActive: true,
    version: 1,
    conditions: [
      { field: "patient.plan.remainingAmount", operator: "less_than", value: 5000 },
    ],
    actions: [
      { type: "warn", message: "Patient is approaching benefit limit", suggestion: "Inform patient of potential out-of-pocket costs" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-005",
    code: "AUTH-001",
    name: "Pre-authorization Required",
    description: "Checks if specific procedures require pre-authorization",
    category: "authorization",
    severity: "warning",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.tariffCode", operator: "in", value: ["1212", "1520", "1550", "2751", "3859"] },
      { field: "claim.authorizationNumber", operator: "not_exists", value: true },
    ],
    actions: [
      { type: "flag", message: "Procedure typically requires pre-authorization", suggestion: "Obtain authorization number before submission" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-006",
    code: "DUP-001",
    name: "Duplicate Claim Detection",
    description: "Identifies potential duplicate claims based on patient, provider, date, and procedure",
    category: "duplicate_detection",
    severity: "error",
    isActive: true,
    version: 1,
    conditions: [
      { field: "duplicate.exists", operator: "equals", value: true },
    ],
    actions: [
      { type: "reject", message: "Potential duplicate claim detected", suggestion: "Review existing claims for the same service date and procedure" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-007",
    code: "PMB-001",
    name: "PMB Condition Check",
    description: "Identifies claims that may qualify for Prescribed Minimum Benefits coverage",
    category: "clinical_appropriateness",
    severity: "info",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.icd10Codes", operator: "in", value: ["I21.0", "I21.1", "I21.2", "I21.3", "I21.4", "I21.9", "C50", "C34", "E10", "E11"] },
    ],
    actions: [
      { type: "flag", message: "Condition may qualify as PMB - full cover applies", suggestion: "Verify PMB status with scheme if disputed" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-008",
    code: "ELIG-001",
    name: "Member Eligibility Check",
    description: "Verifies that the patient has active coverage on the date of service",
    category: "patient_eligibility",
    severity: "error",
    isActive: true,
    version: 1,
    conditions: [
      { field: "patient.isActive", operator: "equals", value: true },
      { field: "claim.dateOfService", operator: "greater_than", value: "patient.effectiveDate" },
    ],
    actions: [
      { type: "reject", message: "Member does not have active coverage", suggestion: "Verify membership status or collect private payment" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-009",
    code: "DOC-001",
    name: "Documentation Completeness",
    description: "Ensures all required documentation fields are populated",
    category: "documentation",
    severity: "warning",
    isActive: true,
    version: 1,
    conditions: [
      { field: "claim.notes", operator: "exists", value: true },
    ],
    actions: [
      { type: "warn", message: "Clinical notes recommended for complex procedures", suggestion: "Add supporting clinical documentation" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "rule-010",
    code: "NAPPI-001",
    name: "NAPPI Code Validation",
    description: "Validates NAPPI codes for medicine and consumable items",
    category: "coding_accuracy",
    severity: "warning",
    isActive: true,
    version: 1,
    conditions: [
      { field: "lineItem.nappiCode", operator: "exists", value: true },
      { field: "lineItem.nappiCode", operator: "regex", value: "^[0-9]{7,8}$" },
    ],
    actions: [
      { type: "warn", message: "NAPPI code format may be invalid", suggestion: "Verify NAPPI code in medicine database" },
    ],
    effectiveFrom: "2024-01-01",
    createdBy: "user-001",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// -----------------------------------------------------------------------------
// Decision Bundles
// -----------------------------------------------------------------------------

export const demoBundles: DecisionBundle[] = [
  {
    id: "bundle-001",
    name: "Standard Validation Bundle",
    description: "Default validation rules applied to all claims",
    ruleIds: ["rule-001", "rule-002", "rule-006", "rule-008"],
    isDefault: true,
    isActive: true,
    priority: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "bundle-002",
    name: "Extended Validation Bundle",
    description: "Comprehensive validation including pricing and benefit checks",
    ruleIds: ["rule-001", "rule-002", "rule-003", "rule-004", "rule-005", "rule-006", "rule-008", "rule-009"],
    isDefault: false,
    isActive: true,
    priority: 2,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "bundle-003",
    name: "PMB Claims Bundle",
    description: "Specialized rules for PMB condition claims",
    ruleIds: ["rule-001", "rule-002", "rule-007", "rule-008"],
    schemeIds: ["scheme-001", "scheme-002", "scheme-003"],
    isDefault: false,
    isActive: true,
    priority: 3,
    createdAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "bundle-004",
    name: "High-Value Procedure Bundle",
    description: "Additional validation for procedures over R10,000",
    ruleIds: ["rule-001", "rule-002", "rule-005", "rule-006", "rule-008", "rule-009"],
    isDefault: false,
    isActive: true,
    priority: 4,
    createdAt: "2024-02-15T00:00:00Z",
  },
];

// -----------------------------------------------------------------------------
// Remittance Advices
// -----------------------------------------------------------------------------

export const demoRemittances: RemittanceAdvice[] = [
  {
    id: "ra-001",
    raNumber: "RA-DH-2024-001",
    schemeId: "scheme-001",
    receivedDate: formatDate(14),
    paymentDate: formatDate(10),
    totalAmount: 27400,
    claimCount: 2,
    status: "reconciled",
    lineItems: [
      {
        id: "rali-001",
        claimId: "claim-001",
        claimNumber: "CLM-2024-00001",
        billedAmount: 1100,
        approvedAmount: 1100,
        paidAmount: 1100,
        adjustmentAmount: 0,
        adjustmentReasons: [],
        patientLiability: 0,
        isMatched: true,
      },
      {
        id: "rali-002",
        claimId: "claim-007",
        claimNumber: "CLM-2024-00007",
        billedAmount: 26300,
        approvedAmount: 26300,
        paidAmount: 26300,
        adjustmentAmount: 0,
        adjustmentReasons: [],
        patientLiability: 0,
        isMatched: true,
      },
    ],
  },
  {
    id: "ra-002",
    raNumber: "RA-DH-2024-002",
    schemeId: "scheme-001",
    receivedDate: formatDate(9),
    paymentDate: formatDate(5),
    totalAmount: 3200,
    claimCount: 1,
    status: "reconciled",
    lineItems: [
      {
        id: "rali-003",
        claimId: "claim-004",
        claimNumber: "CLM-2024-00004",
        billedAmount: 3800,
        approvedAmount: 3200,
        paidAmount: 3200,
        adjustmentAmount: 600,
        adjustmentReasons: ["Rate adjustment - consultation exceeds scheme maximum"],
        patientLiability: 600,
        isMatched: true,
        discrepancyAmount: 600,
        discrepancyReason: "Scheme rate adjustment",
      },
    ],
  },
];

// -----------------------------------------------------------------------------
// Reconciliation Records
// -----------------------------------------------------------------------------

export const demoReconciliations: ReconciliationRecord[] = [
  {
    id: "recon-001",
    claimId: "claim-001",
    remittanceId: "ra-001",
    status: "matched",
    billedAmount: 1100,
    expectedAmount: 1100,
    receivedAmount: 1100,
    variance: 0,
    variancePercentage: 0,
    reconciledAt: formatDate(10),
    reconciledBy: "user-004",
  },
  {
    id: "recon-002",
    claimId: "claim-007",
    remittanceId: "ra-001",
    status: "matched",
    billedAmount: 26300,
    expectedAmount: 26300,
    receivedAmount: 26300,
    variance: 0,
    variancePercentage: 0,
    reconciledAt: formatDate(10),
    reconciledBy: "user-004",
  },
  {
    id: "recon-003",
    claimId: "claim-004",
    remittanceId: "ra-002",
    status: "partial_match",
    billedAmount: 3800,
    expectedAmount: 3800,
    receivedAmount: 3200,
    variance: 600,
    variancePercentage: 15.79,
    reconciledAt: formatDate(5),
    reconciledBy: "user-004",
    notes: "Variance due to scheme rate adjustment - patient liability created",
  },
];

// -----------------------------------------------------------------------------
// Audit Log Entries
// -----------------------------------------------------------------------------

export const demoAuditLogs: AuditLogEntry[] = [
  {
    id: "audit-001",
    timestamp: new Date(today.getTime() - 1000 * 60 * 5).toISOString(),
    action: "claim_created",
    entityType: "claim",
    entityId: "claim-008",
    userId: "user-003",
    userRole: "healthcare_provider",
    description: "New claim CLM-2024-00008 created for patient Cyril Mthembu",
  },
  {
    id: "audit-002",
    timestamp: new Date(today.getTime() - 1000 * 60 * 30).toISOString(),
    action: "validation_run",
    entityType: "claim",
    entityId: "claim-002",
    userId: "user-002",
    userRole: "billing_specialist",
    description: "Validation failed for CLM-2024-00002 - Missing ICD-10 codes",
  },
  {
    id: "audit-003",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60).toISOString(),
    action: "claim_submitted",
    entityType: "claim",
    entityId: "claim-009",
    userId: "user-002",
    userRole: "billing_specialist",
    description: "Claim CLM-2024-00009 submitted to Discovery Health",
  },
  {
    id: "audit-004",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    action: "payment_posted",
    entityType: "claim",
    entityId: "claim-001",
    userId: "user-004",
    userRole: "finance_officer",
    description: "Payment of R1,100.00 posted for CLM-2024-00001",
  },
  {
    id: "audit-005",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 3).toISOString(),
    action: "reconciliation_completed",
    entityType: "reconciliation",
    entityId: "recon-003",
    userId: "user-004",
    userRole: "finance_officer",
    description: "Reconciliation completed for CLM-2024-00004 with R600 variance",
  },
  {
    id: "audit-006",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 4).toISOString(),
    action: "rule_executed",
    entityType: "rule",
    entityId: "rule-006",
    userId: "user-002",
    userRole: "billing_specialist",
    description: "Duplicate detection rule flagged CLM-2024-00005",
  },
  {
    id: "audit-007",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    action: "response_received",
    entityType: "claim",
    entityId: "claim-003",
    userId: "user-002",
    userRole: "billing_specialist",
    description: "Rejection received for CLM-2024-00003 - No pre-authorization",
  },
  {
    id: "audit-008",
    timestamp: new Date(today.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    action: "user_action",
    entityType: "claim",
    entityId: "claim-010",
    userId: "user-002",
    userRole: "billing_specialist",
    description: "Appeal initiated for CLM-2024-00010",
  },
];

// -----------------------------------------------------------------------------
// Demo Scenarios
// -----------------------------------------------------------------------------

export const demoScenarios: DemoScenario[] = [
  {
    id: "scenario-001",
    name: "Clean Success - Full Payment",
    description: "A routine consultation claim that passes all validation and receives full payment",
    category: "success",
    claimId: "claim-001",
  },
  {
    id: "scenario-002",
    name: "Missing ICD-10 Codes",
    description: "Claim fails validation due to missing diagnosis codes on line items",
    category: "validation_failure",
    claimId: "claim-002",
  },
  {
    id: "scenario-003",
    name: "Scheme Rejection - No Authorization",
    description: "Surgical procedure rejected by scheme due to missing pre-authorization",
    category: "rejection",
    claimId: "claim-003",
  },
  {
    id: "scenario-004",
    name: "Partial Payment - Rate Adjustment",
    description: "Claim paid partially due to consultation rate exceeding scheme maximum",
    category: "partial",
    claimId: "claim-004",
  },
  {
    id: "scenario-005",
    name: "Duplicate Claim Detection",
    description: "New claim flagged as potential duplicate of existing paid claim",
    category: "validation_failure",
    claimId: "claim-005",
  },
  {
    id: "scenario-006",
    name: "Benefit Exhausted",
    description: "Claim rejected because patient's day-to-day benefits are exhausted",
    category: "rejection",
    claimId: "claim-006",
  },
  {
    id: "scenario-007",
    name: "PMB Condition - Full Cover",
    description: "Acute MI qualifies as Prescribed Minimum Benefit with mandatory full cover",
    category: "success",
    claimId: "claim-007",
  },
  {
    id: "scenario-008",
    name: "Draft Claim - Ready for Closure",
    description: "New claim in draft status awaiting completion and closure",
    category: "edge_case",
    claimId: "claim-008",
  },
  {
    id: "scenario-009",
    name: "Submitted - Awaiting Response",
    description: "Validated claim submitted to scheme, pending response",
    category: "edge_case",
    claimId: "claim-009",
  },
  {
    id: "scenario-010",
    name: "Appealed Claim",
    description: "Rejected claim under appeal with additional clinical documentation",
    category: "edge_case",
    claimId: "claim-010",
  },
  {
    id: "scenario-011",
    name: "Inactive Member",
    description: "Claim fails eligibility check due to terminated membership",
    category: "validation_failure",
    claimId: "claim-011",
  },
];

// -----------------------------------------------------------------------------
// Tariff Codes Reference (commonly used)
// -----------------------------------------------------------------------------

export const tariffCodes = [
  { code: "0190", description: "Consultation - Level 3", baseRate: 650 },
  { code: "0191", description: "Follow-up consultation", baseRate: 450 },
  { code: "0192", description: "Extended consultation", baseRate: 950 },
  { code: "0141", description: "ECG - 12 lead", baseRate: 350 },
  { code: "1212", description: "Rotator cuff repair", baseRate: 35000 },
  { code: "1520", description: "MRI - single region", baseRate: 5500 },
  { code: "1550", description: "Knee arthroscopy", baseRate: 15000 },
  { code: "2751", description: "Echocardiogram", baseRate: 2500 },
  { code: "3612", description: "Physiotherapy session", baseRate: 550 },
  { code: "3859", description: "Cardiac catheterization", baseRate: 25000 },
];

// -----------------------------------------------------------------------------
// ICD-10 Codes Reference (commonly used)
// -----------------------------------------------------------------------------

export const icd10Codes = [
  { code: "E10", description: "Type 1 diabetes mellitus" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "I21.0", description: "Acute transmural MI of anterior wall" },
  { code: "I21.1", description: "Acute transmural MI of inferior wall" },
  { code: "J06.9", description: "Acute upper respiratory infection, unspecified" },
  { code: "M23.20", description: "Derangement of meniscus due to old tear" },
  { code: "M23.50", description: "Chronic instability of knee" },
  { code: "M54.5", description: "Low back pain" },
  { code: "M75.10", description: "Rotator cuff syndrome" },
  { code: "R10.4", description: "Other and unspecified abdominal pain" },
  { code: "C34", description: "Malignant neoplasm of bronchus and lung" },
  { code: "C50", description: "Malignant neoplasm of breast" },
];
