/**
 * Central type definitions for the application
 * Replaces scattered `unknown` and `any` with proper types
 */

// ============================================================================
// Common Types
// ============================================================================

/** React component render props */
export type RenderProps<T> = {
  children: (props: T) => React.ReactNode;
};

/** Form submission handler */
export type FormSubmitHandler<T extends Record<string, unknown>> = (
  data: T,
) => Promise<void> | void;

/** Async operation result */
export type AsyncResult<T, E = Error> =
  { status: "success"; data: T } | { status: "error"; error: E } | { status: "pending" };

// ============================================================================
// API & Network Types
// ============================================================================

/** HTTP methods */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "OPTIONS";

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** API error response */
export interface ApiErrorResponse {
  status: number;
  statusText: string;
  message: string;
  details?: Record<string, unknown>;
}

// ============================================================================
// Form Types
// ============================================================================

/** Form field value */
export type FormFieldValue = string | number | boolean | null | undefined;

/** Form field error */
export interface FormFieldError {
  field: string;
  message: string;
}

/** Form state */
export interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  isValidating: boolean;
  errors: Record<string, string | string[] | undefined>;
}

// ============================================================================
// Navigation Types
// ============================================================================

/** Navigation link */
export interface NavLink {
  label: string;
  to: string;
  icon?: React.ReactNode;
  children?: NavLink[];
  external?: boolean;
}

/** Breadcrumb item */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================================================
// Content Types
// ============================================================================

/** Blog post metadata */
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author?: string;
  image?: string;
  content: string;
  tags?: string[];
}

/** Page metadata */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  canonicalUrl?: string;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

/** Button variants */
export type ButtonVariant =
  "default" | "primary" | "secondary" | "destructive" | "ghost" | "outline";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

/** Card component props */
export interface CardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

// ============================================================================
// Animation Types
// ============================================================================

/** Animation state */
export type AnimationState = "idle" | "loading" | "playing" | "paused" | "error";

/** Transition config */
export interface TransitionConfig {
  duration: number;
  delay?: number;
  ease?: string | number[];
}

// ============================================================================
// Error Types
// ============================================================================

/** Standard error envelope */
export interface AppError {
  name: string;
  message: string;
  stack?: string;
  cause?: Error;
  context?: Record<string, unknown>;
}

/** Error boundary options */
export interface ErrorBoundaryOptions {
  boundary?: string;
  level?: "page" | "section" | "component";
  fallback?: React.ReactNode;
}

// ============================================================================
// Performance Types
// ============================================================================

/** Core Web Vitals */
export interface CoreWebVitalsMetrics {
  LCP?: number; // Largest Contentful Paint
  INP?: number; // Interaction to Next Paint
  CLS?: number; // Cumulative Layout Shift
  FCP?: number; // First Contentful Paint
  TTFB?: number; // Time to First Byte
}

/** Performance metric rating */
export type MetricRating = "good" | "needs-improvement" | "poor";

// ============================================================================
// Environment Types
// ============================================================================

/** Environment variables */
export interface Env {
  NODE_ENV: "development" | "production" | "test";
  DEBUG?: boolean;
  API_URL?: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/** Non-null type assertion */
export type NonNull<T> = T extends null | undefined ? never : T;

/** Async operation options */
export interface AsyncOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

/** Pagination options */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: "asc" | "desc";
}
