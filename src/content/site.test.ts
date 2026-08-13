import { describe, it, expect } from "vitest";
import { company, navLinks, specialties } from "./site";

describe("Site Content", () => {
  describe("company", () => {
    it("should have required properties", () => {
      expect(company.name).toBeDefined();
      expect(company.legalName).toBeDefined();
      expect(company.address).toBeDefined();
      expect(company.phone).toBeDefined();
      expect(company.email).toBeDefined();
    });

    it("should have valid phone format", () => {
      expect(company.phone).toMatch(/\(\d{3}\)\s\d{3}-\d{4}/);
    });

    it("should have valid phoneHref format", () => {
      expect(company.phoneHref).toMatch(/^tel:\+\d+$/);
    });

    it("should have valid email format", () => {
      expect(company.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("should have business hours defined", () => {
      expect(Array.isArray(company.hours)).toBe(true);
      expect(company.hours.length).toBeGreaterThan(0);
    });

    it("should have all days of week in hours", () => {
      const days = company.hours.map((h) => h[0]);
      expect(days).toContain("Monday");
      expect(days).toContain("Sunday");
    });
  });

  describe("navLinks", () => {
    it("should have navigation links", () => {
      expect(Array.isArray(navLinks)).toBe(true);
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it("should have valid structure for each link", () => {
      navLinks.forEach((link) => {
        expect(link).toHaveProperty("label");
        expect(link).toHaveProperty("to");
        expect(typeof link.label).toBe("string");
        expect(typeof link.to).toBe("string");
        expect(link.to).toMatch(/^\//);
      });
    });

    it("should have important navigation links", () => {
      const labels = navLinks.map((l) => l.label);
      expect(labels.some((l) => l.includes("Story") || l.includes("About"))).toBe(true);
    });
  });

  describe("specialties", () => {
    it("should have specialties defined", () => {
      expect(Array.isArray(specialties)).toBe(true);
      expect(specialties.length).toBeGreaterThan(0);
    });

    it("should have valid structure for each specialty", () => {
      specialties.forEach((specialty) => {
        expect(specialty).toHaveProperty("slug");
        expect(specialty).toHaveProperty("title");
        expect(specialty).toHaveProperty("tagline");
        expect(typeof specialty.slug).toBe("string");
        expect(typeof specialty.title).toBe("string");
        expect(typeof specialty.tagline).toBe("string");
      });
    });

    it("should have unique slugs", () => {
      const slugs = specialties.map((s) => s.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have AI/ML specialty", () => {
      const aiMl = specialties.find((s) => s.slug === "ai-ml");
      expect(aiMl).toBeDefined();
      expect(aiMl?.title).toContain("AI");
    });

    it("should have meaningful descriptions", () => {
      specialties.forEach((specialty) => {
        expect(specialty.tagline.length).toBeGreaterThan(10);
      });
    });
  });
});
