import { describe, expect, it } from "vitest"
import { normalizeTags, slugifyTag, tagLabel } from "./tags"

describe("slugifyTag", () => {
  it("lowercases and hyphenates", () => {
    expect(slugifyTag("Essay")).toBe("essay")
    expect(slugifyTag("prompt-injection")).toBe("prompt-injection")
  })
})

describe("tagLabel", () => {
  it("title-cases slug parts", () => {
    expect(tagLabel("essay")).toBe("Essay")
    expect(tagLabel("live-blog")).toBe("Live Blog")
  })
})

describe("normalizeTags", () => {
  it("dedupes and slugifies", () => {
    expect(normalizeTags(["Essay", "essay", "post"])).toEqual(["essay", "post"])
  })
})
