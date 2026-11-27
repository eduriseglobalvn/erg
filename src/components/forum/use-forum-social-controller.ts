"use client"

import { useMemo, useState } from "react"
import { currentUser, seedPosts } from "./forum-social-data"
import { findComment, getDepth, updateCommentTree } from "./forum-social-model"
import type { CommentNode, ReactionKey } from "./forum-social-types"

export function useForumSocialController() {
    const [posts, setPosts] = useState(seedPosts);
    const [composerText, setComposerText] = useState("");
    const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [activePostId, setActivePostId] = useState<number | null>(null);

    const activePost = useMemo(() => posts.find((post) => post.id === activePostId) || null, [activePostId, posts]);

    const reactToPost = (postId: number, reaction: ReactionKey) => {
        setPosts((current) =>
            current.map((post) => {
                if (post.id !== postId) return post;
                const next = { ...post.reactions };
                if (post.mineReaction) next[post.mineReaction] = Math.max((next[post.mineReaction] || 1) - 1, 0);
                next[reaction] = (next[reaction] || 0) + 1;
                return { ...post, reactions: next, mineReaction: reaction };
            })
        );
    };

    const reactToComment = (postId: number, commentId: number, reaction: ReactionKey) => {
        setPosts((current) =>
            current.map((post) => {
                if (post.id !== postId) return post;
                return {
                    ...post,
                    comments: updateCommentTree(post.comments, commentId, (comment) => {
                        const next = { ...comment.reactions };
                        if (comment.mineReaction) next[comment.mineReaction] = Math.max((next[comment.mineReaction] || 1) - 1, 0);
                        next[reaction] = (next[reaction] || 0) + 1;
                        return { ...comment, reactions: next, mineReaction: reaction };
                    }),
                };
            })
        );
    };

    const createPost = () => {
        const text = composerText.trim();
        if (!text) return;
        setPosts((current) => [
            {
                id: Date.now(),
                author: currentUser.name,
                avatar: currentUser.avatar,
                time: "Vừa xong",
                group: "Bảng tin của tôi",
                content: text,
                image: "discussion",
                tags: ["Mới đăng"],
                reactions: {},
                comments: [],
                shares: 0,
            },
            ...current,
        ]);
        setComposerText("");
    };

    const addComment = (postId: number, parentId?: number) => {
        const key = parentId ? `${postId}-${parentId}` : `${postId}`;
        const text = commentDrafts[key]?.trim();
        if (!text) return;
        const newComment: CommentNode = {
            id: Date.now(),
            author: currentUser.name,
            avatar: currentUser.avatar,
            text,
            time: "Vừa xong",
            reactions: {},
        };

        setPosts((current) =>
            current.map((post) => {
                if (post.id !== postId) return post;
                if (!parentId) return { ...post, comments: [...post.comments, newComment] };
                const parent = findComment(post.comments, parentId);
                const canNest = parent ? getDepth(post.comments, parentId) < 3 : false;
                if (!canNest) return post;
                return {
                    ...post,
                    comments: updateCommentTree(post.comments, parentId, (comment) => ({
                        ...comment,
                        replies: [...(comment.replies || []), newComment],
                    })),
                };
            })
        );
        setCommentDrafts((current) => ({ ...current, [key]: "" }));
        setReplyingTo(null);
    };

    const sharePost = (postId: number) => {
        setPosts((current) => current.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)));
    };

    const toggleSaved = (postId: number) => {
        setPosts((current) => current.map((post) => (post.id === postId ? { ...post, saved: !post.saved } : post)));
    };

    return {
        posts,
        composerText,
        commentDrafts,
        replyingTo,
        activePost,
        setComposerText,
        setCommentDrafts,
        setReplyingTo,
        setActivePostId,
        reactToPost,
        reactToComment,
        createPost,
        addComment,
        sharePost,
        toggleSaved,
    }
}

export type ForumSocialController = ReturnType<typeof useForumSocialController>
