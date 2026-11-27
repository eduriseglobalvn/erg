export type ReactionKey = "like" | "love" | "care" | "haha" | "wow" | "sad" | "angry";

export type CommentNode = {
    id: number;
    author: string;
    avatar: string;
    text: string;
    time: string;
    reactions: Partial<Record<ReactionKey, number>>;
    mineReaction?: ReactionKey;
    replies?: CommentNode[];
};

export type Post = {
    id: number;
    author: string;
    avatar: string;
    time: string;
    group: string;
    content: string;
    image: "discussion" | "workspace" | "poll";
    tags: string[];
    reactions: Partial<Record<ReactionKey, number>>;
    mineReaction?: ReactionKey;
    comments: CommentNode[];
    shares: number;
    saved?: boolean;
};
