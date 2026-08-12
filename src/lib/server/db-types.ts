import type {
  availabilityOptions,
  basisOptions,
  engagementOptions,
  inquiryTypeOptions,
  seniorityOptions,
  specialtyOptions,
} from "@/lib/forms";

type ValueOf<T extends ReadonlyArray<{ value: string }>> = T[number]["value"];

export type SpecialtyValue = ValueOf<typeof specialtyOptions>;
export type SeniorityValue = ValueOf<typeof seniorityOptions>;
export type BasisValue = ValueOf<typeof basisOptions>;
export type AvailabilityValue = ValueOf<typeof availabilityOptions>;
export type InquiryTypeValue = ValueOf<typeof inquiryTypeOptions>;
export type EngagementTypeValue = ValueOf<typeof engagementOptions>;

export type ClientRequirementRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name: string | null;
  skill_needed: SpecialtyValue;
  engagement_type: EngagementTypeValue;
  basis: BasisValue;
  message: string | null;
  ip_address: string | null;
  submitted_at: string;
  read_by_staff: boolean;
  archived_at: string | null;
};

export type ClientRequirementInsert = Omit<
  ClientRequirementRow,
  "id" | "submitted_at" | "read_by_staff" | "archived_at"
> & {
  id?: string;
  submitted_at?: string;
  read_by_staff?: boolean;
  archived_at?: string | null;
};

/** Mirrors candidate_applications after 006_bench_form_fields.sql (seniority, expected_monthly_rate, message). */
export type CandidateApplicationRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  specialty: SpecialtyValue;
  seniority: SeniorityValue | null;
  basis: BasisValue;
  expected_monthly_rate: number | null;
  resume_url: string | null;
  availability: AvailabilityValue | null;
  portfolio_url: string | null;
  linkedin_url: string | null;
  message: string | null;
  ip_address: string | null;
  applied_at: string;
  reviewed_by_staff: boolean;
  archived_at: string | null;
};

export type CandidateApplicationInsert = Omit<
  CandidateApplicationRow,
  "id" | "applied_at" | "reviewed_by_staff" | "archived_at"
> & {
  id?: string;
  applied_at?: string;
  reviewed_by_staff?: boolean;
  archived_at?: string | null;
};

export type ContactSubmissionRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  inquiry_type: InquiryTypeValue;
  message: string | null;
  ip_address: string | null;
  submitted_at: string;
  read_by_staff: boolean;
  archived_at: string | null;
};

export type ContactSubmissionInsert = Omit<
  ContactSubmissionRow,
  "id" | "submitted_at" | "read_by_staff" | "archived_at"
> & {
  id?: string;
  submitted_at?: string;
  read_by_staff?: boolean;
  archived_at?: string | null;
};

export type Database = {
  public: {
    Tables: {
      client_requirements: {
        Row: ClientRequirementRow;
        Insert: ClientRequirementInsert;
        Update: Partial<ClientRequirementInsert>;
        Relationships: [];
      };
      candidate_applications: {
        Row: CandidateApplicationRow;
        Insert: CandidateApplicationInsert;
        Update: Partial<CandidateApplicationInsert>;
        Relationships: [];
      };
      contact_submissions: {
        Row: ContactSubmissionRow;
        Insert: ContactSubmissionInsert;
        Update: Partial<ContactSubmissionInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
