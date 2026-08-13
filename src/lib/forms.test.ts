import { describe, it, expect } from "vitest";
import {
  specialtyOptions,
  seniorityOptions,
  engagementOptions,
  basisOptions,
  availabilityOptions,
  inquiryTypeOptions,
} from "./forms";

describe("Form Options", () => {
  describe("specialtyOptions", () => {
    it("should export specialty options", () => {
      expect(Array.isArray(specialtyOptions)).toBe(true);
      expect(specialtyOptions.length).toBeGreaterThan(0);
    });

    it("should have valid structure", () => {
      specialtyOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
        expect(typeof option.value).toBe("string");
        expect(typeof option.label).toBe("string");
      });
    });

    it("should include AI/ML engineer option", () => {
      const option = specialtyOptions.find((o) => o.value === "ai-ml");
      expect(option).toBeDefined();
      expect(option?.label).toBe("AI/ML Engineer");
    });

    it("should have unique values", () => {
      const values = specialtyOptions.map((o) => o.value);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });

  describe("seniorityOptions", () => {
    it("should export seniority options", () => {
      expect(Array.isArray(seniorityOptions)).toBe(true);
      expect(seniorityOptions.length).toBeGreaterThan(0);
    });

    it("should have valid structure", () => {
      seniorityOptions.forEach((option) => {
        expect(option).toHaveProperty("value");
        expect(option).toHaveProperty("label");
      });
    });

    it("should include all seniority levels", () => {
      const values = seniorityOptions.map((o) => o.value);
      expect(values).toContain("junior");
      expect(values).toContain("mid-level");
      expect(values).toContain("senior");
      expect(values).toContain("lead");
      expect(values).toContain("principal");
    });
  });

  describe("engagementOptions", () => {
    it("should export engagement options", () => {
      expect(Array.isArray(engagementOptions)).toBe(true);
      expect(engagementOptions.length).toBe(2);
    });

    it("should include specialist and pod options", () => {
      const values = engagementOptions.map((o) => o.value);
      expect(values).toContain("specialist");
      expect(values).toContain("pod");
    });
  });

  describe("basisOptions", () => {
    it("should export basis options", () => {
      expect(Array.isArray(basisOptions)).toBe(true);
      expect(basisOptions.length).toBeGreaterThan(0);
    });

    it("should include all basis types", () => {
      const values = basisOptions.map((o) => o.value);
      expect(values).toContain("contract");
      expect(values).toContain("full-time");
      expect(values).toContain("open");
    });
  });

  describe("availabilityOptions", () => {
    it("should export availability options", () => {
      expect(Array.isArray(availabilityOptions)).toBe(true);
      expect(availabilityOptions.length).toBeGreaterThan(0);
    });

    it("should include all availability types", () => {
      const values = availabilityOptions.map((o) => o.value);
      expect(values).toContain("immediately");
      expect(values).toContain("2-4-weeks");
      expect(values).toContain("1-3-months");
    });
  });

  describe("inquiryTypeOptions", () => {
    it("should export inquiry type options", () => {
      expect(Array.isArray(inquiryTypeOptions)).toBe(true);
      expect(inquiryTypeOptions.length).toBeGreaterThan(0);
    });

    it("should include all inquiry types", () => {
      const values = inquiryTypeOptions.map((o) => o.value);
      expect(values).toContain("service_inquiry");
      expect(values).toContain("job_application");
      expect(values).toContain("general");
    });

    it("should have descriptive labels", () => {
      const option = inquiryTypeOptions.find((o) => o.value === "service_inquiry");
      expect(option?.label).toBe("I need to hire talent");
    });
  });
});
