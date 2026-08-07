import type { ReactNode } from "react";

import { contact } from "@/content/pages";
import { cn } from "@/lib/utils";

export function Field({
  label,
  required,
  hint,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-2", className)}>
      <span className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
        {required ? <span className="text-gold">*</span> : null}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const control =
  "w-full rounded-sm border border-input bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-32", props.className)} />;
}

export function SelectInput({
  placeholder,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <select {...props} defaultValue="" className={cn(control, props.className)}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function FormShell({
  title,
  children,
  submitLabel,
}: {
  title: string;
  children: ReactNode;
  submitLabel: string;
}) {
  return (
    <div className="glass-panel rounded-md p-7 md:p-10">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <form
        className="mt-8 grid gap-6 sm:grid-cols-2"
        onSubmit={(e) => e.preventDefault()}
      >
        {children}
        <div className="sm:col-span-2">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {contact.botNotice}
          </p>
          <button
            type="submit"
            disabled
            className="mt-5 inline-flex cursor-not-allowed items-center justify-center rounded-sm bg-cream px-7 py-3.5 font-display text-[0.88rem] font-semibold text-navy opacity-60"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
