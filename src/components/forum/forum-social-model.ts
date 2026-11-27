import type { CommentNode, ReactionKey } from "./forum-social-types"
import { reactions } from "./forum-social-data"

export function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export function reactionTotal(reactionMap: Partial<Record<ReactionKey, number>>) {
    return Object.values(reactionMap).reduce((sum, value) => sum + (value || 0), 0);
}

export function countComments(comments: CommentNode[]): number {
    return comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies || []), 0);
}

export function topReactionIcons(reactionMap: Partial<Record<ReactionKey, number>>) {
    return reactions
        .filter((reaction) => reactionMap[reaction.key])
        .sort((a, b) => (reactionMap[b.key] || 0) - (reactionMap[a.key] || 0))
        .slice(0, 3);
}

export function findComment(nodes: CommentNode[], id: number): CommentNode | undefined {
    for (const node of nodes) {
        if (node.id === id) return node;
        const found = node.replies ? findComment(node.replies, id) : undefined;
        if (found) return found;
    }
}

export function updateCommentTree(nodes: CommentNode[], id: number, updater: (node: CommentNode) => CommentNode): CommentNode[] {
    return nodes.map((node) => {
        if (node.id === id) return updater(node);
        if (!node.replies) return node;
        return { ...node, replies: updateCommentTree(node.replies, id, updater) };
    });
}

export function getDepth(nodes: CommentNode[], id: number, depth = 1): number {
    for (const node of nodes) {
        if (node.id === id) return depth;
        const found = node.replies ? getDepth(node.replies, id, depth + 1) : 0;
        if (found) return found;
    }
    return 0;
}

export type ForumFeedPageState<T extends { id: string | number }> = {
    items: T[]
    latestRequestId: number
    nextCursor: string | null
}

export type ForumFeedPage<T extends { id: string | number }> = {
    requestId: number
    items: T[]
    nextCursor: string | null
    mode: "append" | "replace"
}

export function reconcileForumFeedPage<T extends { id: string | number }>(
    state: ForumFeedPageState<T>,
    page: ForumFeedPage<T>,
): ForumFeedPageState<T> {
    if (page.requestId !== state.latestRequestId) return state
    if (page.mode === "replace") return { items: page.items, latestRequestId: page.requestId, nextCursor: page.nextCursor }
    const seen = new Set(state.items.map((item) => item.id))
    const appended = page.items.filter((item) => !seen.has(item.id))
    return { items: [...state.items, ...appended], latestRequestId: page.requestId, nextCursor: page.nextCursor }
}
