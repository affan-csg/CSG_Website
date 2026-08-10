import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  type RequirementFormData,
  type FormStatus,
  specialtyOptions,
  engagementOptions,
  basisOptions,
  submitViaEmail,
} from "@/lib/forms";

interface RequirementFormProps {
  defaultSkill?: string;
  className?: string;
}

export function RequirementForm({ defaultSkill, className }: RequirementFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<RequirementFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    skillNeeded: defaultSkill || "",
    engagementType: "",
    basis: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitViaEmail("requirement", formData);
      if (result.success) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyName: "",
          skillNeeded: defaultSkill || "",
          engagementType: "",
          basis: "",
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-md border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="heading-subsection font-display text-green-400">
          Requirement received!
        </p>
        <p className="mt-2 body-small text-muted-foreground">
          We&apos;ll follow up shortly with potential candidates.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 button-text text-gold hover:text-gold/80"
        >
          Submit another requirement
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            First name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Jane"
            autoComplete="given-name"
            className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            Last name <span className="text-gold">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            autoComplete="family-name"
            className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            Email <span className="text-gold">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            autoComplete="email"
            className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            Phone <span className="text-gold">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="(443) 875-9677"
            autoComplete="tel"
            className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="companyName"
          className="form-label-small mb-2 block text-muted-foreground"
        >
          Company name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Acme Inc."
          autoComplete="organization"
          className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="skillNeeded"
          className="form-label-small mb-2 block text-muted-foreground"
        >
          Skill needed <span className="text-gold">*</span>
        </label>
        <select
          id="skillNeeded"
          name="skillNeeded"
          required
          value={formData.skillNeeded}
          onChange={handleChange}
          className="form-input w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        >
          <option value="" disabled>
            Select the specialty you need
          </option>
          {specialtyOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="engagementType"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            Engagement type <span className="text-gold">*</span>
          </label>
          <select
            id="engagementType"
            name="engagementType"
            required
            value={formData.engagementType}
            onChange={handleChange}
            className="form-input w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          >
            <option value="" disabled>
              Specialist or pod?
            </option>
            {engagementOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="basis"
            className="form-label-small mb-2 block text-muted-foreground"
          >
            Basis <span className="text-gold">*</span>
          </label>
          <select
            id="basis"
            name="basis"
            required
            value={formData.basis}
            onChange={handleChange}
            className="form-input w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          >
            <option value="" disabled>
              Contract or full-time?
            </option>
            {basisOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="form-label-small mb-2 block text-muted-foreground"
        >
          Tell us more
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          maxLength={1000}
          placeholder="Anything else that helps us match the right talent — timeline, must-have skills, team context."
          className="form-input w-full rounded-md border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none resize-none"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {errorMessage && (
        <p className="body-small text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="button-text w-full rounded-md bg-cream px-6 py-3.5 font-display text-navy transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting requirement..." : "Submit requirement"}
      </button>
    </form>
  );
}
