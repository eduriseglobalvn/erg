import { describe, expect, test } from "bun:test"
import { isAllowedUri, sanitizeUrl } from "../src/lib/tiptap-url-utils"

describe("Tiptap URL sanitizer", () => {
  test("keeps safe absolute and relative URLs", () => {
    expect(sanitizeUrl("/tin-tuc", "https://erg.edu.vn/editor")).toBe("https://erg.edu.vn/tin-tuc")
    expect(sanitizeUrl("mailto:hello@erg.edu.vn", "https://erg.edu.vn")).toBe("mailto:hello@erg.edu.vn")
  })

  test("blocks script protocols even when whitespace is injected", () => {
    expect(isAllowedUri("java\nscript:alert(1)")).toBeNull()
    expect(sanitizeUrl("javascript:alert(1)", "https://erg.edu.vn")).toBe("#")
  })

  test("supports explicitly registered protocols", () => {
    expect(sanitizeUrl("webcal://erg.edu.vn/calendar", "https://erg.edu.vn", ["webcal"]))
      .toBe("webcal://erg.edu.vn/calendar")
  })
})
