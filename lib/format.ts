// =============================================================================
// SA Medical Aid Billing Platform - Formatting Utilities
// =============================================================================

/**
 * Format a number as South African Rand currency
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return "R0.00";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string to locale date
 */
export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string to locale date and time
 */
export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a date string to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  
  return formatDate(dateString);
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number | undefined | null, decimals = 1): string {
  if (value === undefined || value === null) return "0%";
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a phone number for display
 */
export function formatPhoneNumber(phone: string | undefined | null): string {
  if (!phone) return "-";
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Format as SA number
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

/**
 * Format an ID number for display (with masking)
 */
export function formatIdNumber(idNumber: string | undefined | null, mask = true): string {
  if (!idNumber) return "-";
  if (!mask) return idNumber;
  // Show first 6 and last 4 digits
  if (idNumber.length === 13) {
    return `${idNumber.slice(0, 6)}***${idNumber.slice(-4)}`;
  }
  return idNumber;
}

/**
 * Format a member number
 */
export function formatMemberNumber(memberNumber: string, dependantCode: string): string {
  return `${memberNumber}-${dependantCode.padStart(2, "0")}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string | undefined | null, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
