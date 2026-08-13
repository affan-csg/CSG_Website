import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should handle conditional classes", () => {
    const isFalse = false;
    const isTrue = true;
    expect(cn("px-2", isFalse && "py-1", isTrue && "bg-red-500")).toBe("px-2 bg-red-500");
  });

  it("should merge tailwind conflicts correctly", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
  });

  it("should handle complex tailwind merging", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn("", "", "")).toBe("");
  });

  it("should handle undefined and null", () => {
    expect(cn("px-2", undefined, null)).toBe("px-2");
  });

  it("should handle arrays of class names", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("should handle objects with conditions", () => {
    expect(cn({ "px-2": true, "py-1": false })).toBe("px-2");
  });

  it("should handle mixed inputs", () => {
    expect(cn("px-2", { "py-1": true, "bg-red-500": false }, ["text-lg"])).toBe(
      "px-2 py-1 text-lg",
    );
  });

  it("should resolve conflicting tailwind padding classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("should preserve non-conflicting classes", () => {
    expect(cn("px-2", "py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });
});
