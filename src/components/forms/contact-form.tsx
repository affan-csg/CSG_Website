import { useState } from "react";

import { cn } from "@/lib/utils";
import {
  type ContactFormData,
  type FormStatus,
  inquiryTypeOptions,
  submitViaEmail,
} from "@/lib/forms";

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    inquiryType: "",
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
      const result = await submitViaEmail("contact", formData);
      if (result.success) {
        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          inquiryType: "",
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
          Message sent!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll be in touch soon. Thank you for reaching out.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-gold hover:text-gold/80"
        >
          Send another message
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
          htmlFor="inquiryType"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          What&apos;s this about? <span className="text-gold">*</span>
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          required
          value={formData.inquiryType}
          onChange={handleChange}
          className="w-full appearance-none rounded-md border border-input bg-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
        >
          <option value="" disabled>
            Select what this is about
          </option>
          {inquiryTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          maxLength={500}
          placeholder="Tell us a bit about what you need or what's on your mind."
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none resize-none"
        />
      </div>

      {/* Honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <input
          type="text"
          name="company_name"
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
        {status === "submitting" ? "Sending message..." : "Send message"}
      </button>
    </form>
  );
}
