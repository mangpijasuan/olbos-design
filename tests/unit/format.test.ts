import { describe, it, expect } from "vitest";
import { titleCase } from "@/lib/format";

describe("titleCase", () => {
  it("converts SCREAMING_SNAKE_CASE enum values to Title Case", () => {
    expect(titleCase("PASSWORD_PROTECTED")).toBe("Password Protected");
  });

  it("handles a single word", () => {
    expect(titleCase("DRAFT")).toBe("Draft");
  });

  it("handles already-lowercase input", () => {
    expect(titleCase("accepted")).toBe("Accepted");
  });
});
