import { describe, expect, it } from "bun:test"

import { reconcileForumFeedPage } from "../src/components/forum/forum-social-model.ts"

describe("forum feed pagination", () => {
    const first = { id: 1 }
    const second = { id: 2 }

    it("ignores a stale response that loses the request race", () => {
        const state = { items: [first], latestRequestId: 4, nextCursor: "next" }
        const result = reconcileForumFeedPage(state, {
            requestId: 3,
            items: [second],
            nextCursor: null,
            mode: "append",
        })
        expect(result).toBe(state)
    })

    it("appends the latest page without duplicating existing posts", () => {
        const result = reconcileForumFeedPage(
            { items: [first], latestRequestId: 4, nextCursor: "next" },
            { requestId: 4, items: [first, second], nextCursor: null, mode: "append" },
        )
        expect(result).toEqual({ items: [first, second], latestRequestId: 4, nextCursor: null })
    })
})
