import { describe, expect, test } from "bun:test"
import { filterElement } from "../src/utils/sanitize-html"

describe("post HTML allow-list (DOM-free)", () => {
  test("drops script and iframe with children", () => {
    expect(filterElement("script", {}).action).toBe("drop")
    expect(filterElement("iframe", { src: "https://x.test" }).action).toBe("drop")
  })

  test("removes on* attributes and unlisted attributes", () => {
    const { action, attribs } = filterElement("p", { onclick: "x()", onMouseOver: "x()", foo: "1", class: "a" })
    expect(action).toBe("keep")
    expect(attribs).toEqual({ class: "a" })
  })

  test("rejects javascript: hrefs, including obfuscated", () => {
    for (const href of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "  java\nscript:alert(1)", "java\tscript:alert(1)"]) {
      expect(filterElement("a", { href }).attribs.href).toBeUndefined()
    }
    expect(filterElement("img", { src: "data:text/html;base64,AAAA" }).attribs.src).toBeUndefined()
  })

  test("passes normal content unchanged", () => {
    expect(filterElement("p", {})).toEqual({ action: "keep", attribs: {} })
    const link = { href: "https://erg.edu.vn/a", title: "t" }
    expect(filterElement("a", link).attribs).toEqual(link)
    for (const href of ["/tin-tuc", "#top", "mailto:a@b.vn", "tel:+84123", "page.html"]) {
      expect(filterElement("a", { href }).attribs.href).toBe(href)
    }
    const img = { src: "/a.png", alt: "x", width: "10" }
    expect(filterElement("img", img).attribs).toEqual(img)
  })

  test("adds rel for target=_blank", () => {
    expect(filterElement("a", { href: "/x", target: "_blank" }).attribs.rel).toBe("noopener noreferrer")
  })

  test("input limited to disabled checkboxes", () => {
    expect(filterElement("input", { type: "text" }).action).toBe("drop")
    expect(filterElement("input", { type: "checkbox", checked: "" }).attribs).toEqual({ type: "checkbox", checked: "", disabled: "" })
  })
})
