import { describe, it, expect } from "vitest";
import { slugify, randomSuffix } from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Grace & Daniel's Wedding")).toBe("grace-daniel-s-wedding");
  });

  it("collapses repeated separators", () => {
    expect(slugify("Hello   World!!!")).toBe("hello-world");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("--Party Time--")).toBe("party-time");
  });

  it("returns an empty string for input with no alphanumerics", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("randomSuffix", () => {
  it("defaults to 6 characters", () => {
    expect(randomSuffix()).toHaveLength(6);
  });

  it("respects a custom length", () => {
    expect(randomSuffix(10)).toHaveLength(10);
  });

  it("only uses lowercase letters and digits", () => {
    expect(randomSuffix(50)).toMatch(/^[a-z0-9]+$/);
  });
});
