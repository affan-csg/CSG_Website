export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

export interface RequirementFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  skillNeeded: string;
  engagementType: string;
  basis: string;
  message: string;
}

export interface BenchFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  specialty: string;
  basis: string;
  availability: string;
  portfolioUrl: string;
  linkedinUrl: string;
  resume?: File;
  message: string;
}

export const specialtyOptions = [
  { value: "ai-ml", label: "AI & ML Engineering" },
  { value: "mlops", label: "MLOps Engineering" },
  { value: "data", label: "Data Engineering, Data Science & Analytics" },
  { value: "devops", label: "DevOps Engineering" },
  { value: "devsecops", label: "DevSecOps & Platform Engineering" },
  { value: "cloud", label: "Cloud Engineering & Architecture" },
  { value: "software-dev", label: "Software Development" },
  { value: "product", label: "Product & Project Management" },
] as const;

export const engagementOptions = [
  { value: "specialist", label: "A single specialist" },
  { value: "pod", label: "A consulting pod" },
] as const;

export const basisOptions = [
  { value: "contract", label: "Contract" },
  { value: "full-time", label: "Full-time" },
  { value: "open", label: "Open to either" },
] as const;

export const availabilityOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "2-4-weeks", label: "2–4 weeks" },
  { value: "1-3-months", label: "1–3 months" },
] as const;

export const inquiryTypeOptions = [
  { value: "service_inquiry", label: "I need to hire talent" },
  { value: "job_application", label: "I'm looking for work" },
  { value: "general", label: "Something else" },
] as const;

/**
 * Submit form data via email (mailto) as a simple fallback.
 * For production, you'd want to use a backend API with Supabase/Resend.
 */
export function submitViaEmail(
  type: "contact" | "requirement" | "bench",
  data: ContactFormData | RequirementFormData | BenchFormData,
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real implementation, this would call an API endpoint
      // For now, we'll create a mailto link
      const subject = encodeURIComponent(
        type === "contact"
          ? `Contact Form: ${(data as ContactFormData).inquiryType}`
          : type === "requirement"
            ? `Staffing Requirement from ${(data as RequirementFormData).companyName || "Client"}`
            : `Bench Application from ${(data as BenchFormData).firstName} ${(data as BenchFormData).lastName}`,
      );

      const body = encodeURIComponent(
        Object.entries(data)
          .filter(([key]) => key !== "turnstileToken" && key !== "company_name" && key !== "website")
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      );

      // Open mailto link
      window.open(
        `mailto:hello@careersourcegroup.com?subject=${subject}&body=${body}`,
        "_blank",
      );

      resolve({
        success: true,
        message: "Form submitted successfully! We'll be in touch soon.",
      });
    }, 1000);
  });
}
