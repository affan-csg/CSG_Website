import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkEmailRateLimit, checkIpRateLimit, RATE_LIMITS } from "@/lib/server/rate-limit";
import * as submissions from "@/lib/server/submissions";

vi.mock("@/lib/server/submissions");

describe("RATE_LIMITS constants", () => {
  it("defines email limit of 5 per hour", () => {
    expect(RATE_LIMITS.perEmailPerHour).toBe(5);
  });

  it("defines IP limit of 20 per hour", () => {
    expect(RATE_LIMITS.perIpPerHour).toBe(20);
  });
});

describe("checkEmailRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows submission when under email limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(2);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(1);

    const result = await checkEmailRateLimit("test@example.com");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2); // 5 - (2 + 1)
  });

  it("blocks submission when at email limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(3);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(2);

    const result = await checkEmailRateLimit("test@example.com");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0); // 5 - (3 + 2) = 0
  });

  it("blocks submission when exceeding email limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(4);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(3);

    const result = await checkEmailRateLimit("test@example.com");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0); // Math.max(0, 5 - 7)
  });

  it("allows first submission from new email", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(0);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(0);

    const result = await checkEmailRateLimit("new@example.com");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5); // 5 - 0
  });

  it("returns reset time approximately 1 hour in future", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(0);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(0);

    const beforeCheck = Date.now();
    const result = await checkEmailRateLimit("test@example.com");
    const afterCheck = Date.now();

    const oneHourMs = 60 * 60 * 1000;
    expect(result.resetAt).toBeGreaterThanOrEqual(beforeCheck + oneHourMs);
    expect(result.resetAt).toBeLessThanOrEqual(afterCheck + oneHourMs);
  });

  it("queries both client requirements and applications", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(1);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(2);

    await checkEmailRateLimit("test@example.com");

    expect(submissions.countRecentClientRequirementsByEmail).toHaveBeenCalledWith(
      "test@example.com",
    );
    expect(submissions.countRecentApplicationsByEmail).toHaveBeenCalledWith("test@example.com");
  });

  it("queries both sources in parallel", async () => {
    const clientMock = vi
      .mocked(submissions.countRecentClientRequirementsByEmail)
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(1), 10);
          }),
      );
    const appMock = vi.mocked(submissions.countRecentApplicationsByEmail).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(2), 10);
        }),
    );

    const start = Date.now();
    await checkEmailRateLimit("test@example.com");
    const elapsed = Date.now() - start;

    expect(clientMock).toHaveBeenCalled();
    expect(appMock).toHaveBeenCalled();
    expect(elapsed).toBeLessThan(50); // Should run in parallel, not sequential (>20ms)
  });
});

describe("checkIpRateLimit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows submission when under IP limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(10);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(5);

    const result = await checkIpRateLimit("192.168.1.1");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5); // 20 - (10 + 5)
  });

  it("blocks submission when at IP limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(12);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(8);

    const result = await checkIpRateLimit("192.168.1.1");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0); // 20 - (12 + 8) = 0
  });

  it("blocks submission when exceeding IP limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(15);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(10);

    const result = await checkIpRateLimit("192.168.1.1");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0); // Math.max(0, 20 - 25)
  });

  it("allows first submission from new IP", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(0);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(0);

    const result = await checkIpRateLimit("10.0.0.1");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(20); // 20 - 0
  });

  it("has higher limit than email rate limit", () => {
    expect(RATE_LIMITS.perIpPerHour).toBeGreaterThan(RATE_LIMITS.perEmailPerHour);
  });

  it("returns reset time approximately 1 hour in future", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(0);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(0);

    const beforeCheck = Date.now();
    const result = await checkIpRateLimit("192.168.1.1");
    const afterCheck = Date.now();

    const oneHourMs = 60 * 60 * 1000;
    expect(result.resetAt).toBeGreaterThanOrEqual(beforeCheck + oneHourMs);
    expect(result.resetAt).toBeLessThanOrEqual(afterCheck + oneHourMs);
  });

  it("queries both client requirements and applications by IP", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(5);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(3);

    await checkIpRateLimit("203.0.113.45");

    expect(submissions.countRecentClientRequirementsByIp).toHaveBeenCalledWith("203.0.113.45");
    expect(submissions.countRecentApplicationsByIp).toHaveBeenCalledWith("203.0.113.45");
  });

  it("queries both sources in parallel", async () => {
    const clientMock = vi.mocked(submissions.countRecentClientRequirementsByIp).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(5), 10);
        }),
    );
    const appMock = vi.mocked(submissions.countRecentApplicationsByIp).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(8), 10);
        }),
    );

    const start = Date.now();
    await checkIpRateLimit("192.168.1.1");
    const elapsed = Date.now() - start;

    expect(clientMock).toHaveBeenCalled();
    expect(appMock).toHaveBeenCalled();
    expect(elapsed).toBeLessThan(50); // Should run in parallel, not sequential
  });
});

describe("rate limit edge cases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("correctly handles zero submissions", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(0);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(0);

    const result = await checkEmailRateLimit("test@example.com");

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it("correctly handles exactly at limit", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByEmail).mockResolvedValue(2);
    vi.mocked(submissions.countRecentApplicationsByEmail).mockResolvedValue(3);

    const result = await checkEmailRateLimit("test@example.com");

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("never returns negative remaining count", async () => {
    vi.mocked(submissions.countRecentClientRequirementsByIp).mockResolvedValue(100);
    vi.mocked(submissions.countRecentApplicationsByIp).mockResolvedValue(100);

    const result = await checkIpRateLimit("192.168.1.1");

    expect(result.remaining).toBeGreaterThanOrEqual(0);
  });
});
