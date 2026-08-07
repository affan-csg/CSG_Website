import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  type BenchFormData,
  type FormStatus,
  specialtyOptions,
  basisOptions,
  availabilityOptions,
  submitViaEmail,
} from "@/lib/forms";

interface BenchFormProps {
  defaultSkill?: string;
  className?: string;
}

export function BenchForm({ defaultSkill, className }: BenchFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<BenchFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    specialty: defaultSkill || "",
    basis: "",
    availability: "",
    portfolioUrl: "",
    linkedinUrl: "",
    resume: undefined as File | undefined,
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
      const result = await submitViaEmail("bench", formData);
      if (result.success) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          location: "",
          specialty: defaultSkill || "",
          basis: "",
          availability: "",
          portfolioUrl: "",
          linkedinUrl: "",
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
        <p className="font-display text-lg font-semibold text-green-400">
          Application received!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for applying â we&apos;ll be in touch when opportunities open.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-gold hover:text-gold/80"
        >
          Submit another application
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
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
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
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
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
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
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
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
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
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="location"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Location <span className="text-gold">*</span>
        </label>
        <input
          type="text"
          id="location"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          autoComplete="address-level2"
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Wherever you&apos;re based â our clients hire across the US, LATAM, and Pakistan.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="specialty"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Specialty <span className="text-gold">*</span>
          </label>
          <select
            id="specialty"
            name="specialty"
            required
            value={formData.specialty}
            onChange={handleChange}
            className="w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          >
            <option value="" disabled>
              Select your specialty
            </option>
            {specialtyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="basis"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Basis <span className="text-gold">*</span>
          </label>
          <select
            id="basis"
            name="basis"
            required
            value={formData.basis}
            onChange={handleChange}
            className="w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
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
          htmlFor="availability"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Availability
        </label>
        <select
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          className="w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        >
          <option value="" disabled>
            When could you start?
          </option>
          {availabilityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="portfolioUrl"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
          >
            Portfolio URL
          </label>
          <input
            type="url"
            id="portfolioUrl"
            name="portfolioUrl"
            value={formData.portfolioUrl}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
            autoComplete="url"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Optional â a personal site, GitHub, or work samples.
          </p>
        </div>
        <div>
          <label
            htmlFor="linkedinUrl"
            className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
          >
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/your-name"
            autoComplete="url"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="resume"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Résumé <span className="text-gold">*</span>
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          required
          accept=".pdf,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFormData((prev) => ({ ...prev, resume: file }));
            }
          }}
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-gold/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-gold hover:file:bg-gold/30"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          PDF or Word document, 5 MB max.
        </p>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Additional information
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          placeholder="Anything else you'd like us to know."
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none resize-none"
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
        <p className="text-sm text-red-400" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-md bg-cream px-6 py-3.5 font-display text-[0.88rem] font-semibold text-navy transition-all duration-300 hover:bg-gold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting application..." : "Submit application"}
      </button>
    </form>
  );
}
