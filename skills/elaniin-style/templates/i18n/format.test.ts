import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatMonth,
  formatNumber,
  formatPercent,
  formatTime,
  intlLocale,
  plainSpaces,
} from "./format";

describe("format", () => {
  it("formats a year-month in the language of the page", () => {
    expect(formatMonth("en", "2026-09")).toBe("Sep 2026");
    expect(formatMonth("es", "2026-09")).toBe("sept 2026");
  });

  it("follows en-US for English and El Salvador (es-SV) for Spanish", () => {
    expect(intlLocale("en")).toBe("en-US");
    expect(intlLocale("es")).toBe("es-SV");
  });

  it("uses the same separators in both languages (decimal point, comma for thousands)", () => {
    expect(formatNumber("en", 1234.5)).toBe("1,234.5");
    expect(formatNumber("es", 1234.5)).toBe("1,234.5");
    expect(formatNumber("es", 1800)).toBe("1,800");
  });

  it("formats US dollars with a narrow symbol and two decimals", () => {
    expect(formatCurrency("en", 128.5, "USD")).toBe("$128.50");
    expect(formatCurrency("es", 128.5, "USD")).toBe("$128.50");
  });

  it("formats percentages from a fraction, with optional decimals and sign", () => {
    expect(formatPercent("en", 0.82)).toBe("82%");
    expect(formatPercent("en", 0.9998, { decimals: 2 })).toBe("99.98%");
    expect(formatPercent("es", 0.9998, { decimals: 2 })).toBe("99.98%");
    expect(formatPercent("en", 0.35, { signed: true })).toBe("+35%");
    expect(formatPercent("en", -0.18, { signed: true })).toBe("-18%");
  });

  it("formats a clock time on a 12-hour clock in both languages", () => {
    expect(formatTime("en", "14:30")).toBe("2:30 PM");
    expect(formatTime("es", "14:30")).toBe("2:30 p. m.");
    expect(formatTime("es", "09:12")).toBe("9:12 a. m.");
  });

  it("prints times with plain spaces only, so the server and the browser agree (hydration)", () => {
    expect(plainSpaces("2:30\u00a0PM")).toBe("2:30 PM");
    expect(plainSpaces("2:30\u202fp.\u00a0m.")).toBe("2:30 p. m.");
    expect(formatTime("es", "14:30")).not.toMatch(/[\u00a0\u202f]/);
    expect(formatTime("en", "14:30")).not.toMatch(/[\u00a0\u202f]/);
  });
});
