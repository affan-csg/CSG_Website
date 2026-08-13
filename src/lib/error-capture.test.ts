import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { describeError, consumeLastCapturedError } from "./error-capture";

describe("Error Capture", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe("describeError", () => {
    it("should describe a basic Error", () => {
      const error = new Error("Test error");
      const description = describeError(error);

      expect(description).toContain("Test error");
      expect(description).toContain("Error");
    });

    it("should include stack trace", () => {
      const error = new Error("Test error");
      const description = describeError(error);

      expect(description).toContain("at");
    });

    it("should handle error with status code", () => {
      const error = new Error("Unauthorized") as Error & { status?: number };
      error.status = 401;
      const description = describeError(error);

      expect(description).toContain("status 401");
    });

    it("should handle error with statusCode property", () => {
      const error = new Error("Not Found") as Error & { statusCode?: number };
      error.statusCode = 404;
      const description = describeError(error);

      expect(description).toContain("status 404");
    });

    it("should handle string errors", () => {
      const description = describeError("A string error");

      expect(description).toContain("A string error");
    });

    it("should handle null/undefined safely", () => {
      const descNull = describeError(null);
      const descUndef = describeError(undefined);

      expect(typeof descNull).toBe("string");
      expect(typeof descUndef).toBe("string");
    });

    it("should handle error with cause chain", () => {
      const cause = new Error("Original cause");
      const error = new Error("Wrapper error") as Error & { cause?: Error };
      error.cause = cause;
      const description = describeError(error);

      expect(description).toContain("Wrapper error");
      expect(description).toContain("caused by");
      expect(description).toContain("Original cause");
    });

    it("should limit cause chain depth", () => {
      let error: Error & { cause?: unknown } = new Error("Level 0");
      for (let i = 1; i < 10; i++) {
        const next = new Error(`Level ${i}`) as Error & { cause?: unknown };
        next.cause = error;
        error = next;
      }

      const description = describeError(error);
      const causeCounts = (description.match(/caused by/g) || []).length;

      expect(causeCounts).toBeLessThanOrEqual(4);
    });

    it("should limit description length", () => {
      const longMessage = "x".repeat(10000);
      const error = new Error(longMessage);
      const description = describeError(error);

      expect(description.length).toBeLessThanOrEqual(8000);
    });

    it("should handle object errors safely", () => {
      const description = describeError({ message: "custom", code: "ERR_CUSTOM" });

      expect(description).toBeTruthy();
      expect(() => describeError(description)).not.toThrow();
    });

    it("should handle circular references safely", () => {
      const obj: Record<string, unknown> = { message: "test" };
      obj.self = obj;

      expect(() => describeError(obj)).not.toThrow();
    });
  });

  describe("consumeLastCapturedError", () => {
    it("should return undefined when no error captured", () => {
      const error = consumeLastCapturedError();
      expect(error === undefined).toBe(true);
    });

    it("should return a function that can be called", () => {
      expect(typeof consumeLastCapturedError).toBe("function");
    });
  });
});
