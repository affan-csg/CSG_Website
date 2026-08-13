import { useState } from "react";

import type { FormStatus } from "@/lib/forms";
import type { SubmitResult } from "@/lib/form-actions";

export function useFormSubmit<T>(initialData: T) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState<T>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submit = async (submitFn: () => Promise<SubmitResult>, resetData: T) => {
    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await submitFn();
      if (result.success) {
        setStatus("success");
        setFormData(resetData);
      } else {
        setStatus("error");
        setErrorMessage(result.message);
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return { status, setStatus, errorMessage, formData, setFormData, handleChange, submit };
}
