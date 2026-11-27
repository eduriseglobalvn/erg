"use client"

import type { Dispatch, SetStateAction } from "react"
import { Bookmark, Camera, ChevronDown, Ellipsis, Laugh, MessageCircle, Send, Share2, X } from "lucide-react"
import { currentUser, reactions } from "./forum-social-data"
import { countComments, cx, reactionTotal } from "./forum-social-model"
import { Avatar, ReactionBadge, ReactionPicker, SocialImage } from "./forum-social-primitives"
import type { CommentNode, Post, ReactionKey } from "./forum-social-types"

export function PostCard(props: {
    post: Post;
    onOpen: () => void;
    onReact: (reaction: ReactionKey) => void;
    onShare: () => void;
    onToggleSaved: () => void;
    commentDrafts: Record<string, string>;
    setCommentDrafts: Dispatch<SetStateAction<Record<string, string>>>;
    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    onAddComment: (postId: number, parentId?: number) => void;
    onReactComment: (postId: number, commentId: number, reaction: ReactionKey) => void;
}) {
    const { post } = props;
    const activeReaction = reactions.find((reaction) => reaction.key === post.mineReaction);
    return (
        <article className="overflow-hidden rounded-xl bg-white shadow-sm">
            <PostHeader post={post} onToggleSaved={props.onToggleSaved} />
            <button type="button" onClick={props.onOpen} className="block w-full text-left">
                <div className="px-3 pb-3">
                    <p className="whitespace-pre-line text-[15px] leading-6">{post.content}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-[#e7f3ff] px-3 py-1 text-[13px] font-semibold text-[#1877f2]">#{tag}</span>
                        ))}
                    </div>
                </div>
                <SocialImage variant={post.image} />
            </button>
            <PostActions post={post} onOpen={props.onOpen} onReact={props.onReact} onShare={props.onShare} activeReaction={activeReaction} />
            <div className="px-3 pb-3">
                <button type="button" onClick={props.onOpen} className="mb-2 text-[15px] font-semibold text-[#65676b] hover:underline">
                    Xem thêm bình luận
                </button>
                <CommentList {...props} comments={post.comments.slice(0, 2)} depth={1} />
                <CommentInput postId={post.id} commentDrafts={props.commentDrafts} setCommentDrafts={props.setCommentDrafts} onAddComment={props.onAddComment} />
            </div>
        </article>
    );
}

function PostHeader({ post, onToggleSaved }: { post: Post; onToggleSaved: () => void }) {
    return (
        <header className="flex items-start gap-2 p-3">
            <Avatar label={post.avatar} className="bg-slate-700 text-white" />
            <div className="min-w-0 flex-1">
                <p className="font-semibold leading-5">{post.author}</p>
                <p className="truncate text-[13px] text-[#65676b]">
                    {post.group} · {post.time} · Công khai
                </p>
            </div>
            <button type="button" onClick={onToggleSaved} className={cx("flex h-9 w-9 items-center justify-center rounded-full transition duration-200 hover:bg-[#f2f2f2]", post.saved ? "text-[#1877f2]" : "text-[#65676b]")} aria-label="Lưu bài viết">
                <Bookmark size={20} fill={post.saved ? "currentColor" : "none"} />
            </button>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full text-[#65676b] transition duration-200 hover:bg-[#f2f2f2]" aria-label="Tuỳ chọn">
                <Ellipsis size={22} />
            </button>
        </header>
    );
}

function PostActions({ post, onOpen, onReact, onShare, activeReaction }: { post: Post; onOpen: () => void; onReact: (reaction: ReactionKey) => void; onShare: () => void; activeReaction?: (typeof reactions)[number] }) {
    return (
        <div className="px-3 py-2">
            <div className="flex items-center justify-between pb-2 text-[15px] text-[#65676b]">
                <button type="button" onClick={onOpen} className="flex items-center gap-1 hover:underline">
                    <ReactionBadge reactionMap={post.reactions} />
                    <span>{reactionTotal(post.reactions).toLocaleString("vi-VN")}</span>
                </button>
                <button type="button" onClick={onOpen} className="hover:underline">
                    {countComments(post.comments)} bình luận · {post.shares} lượt chia sẻ
                </button>
            </div>
            <div className="grid grid-cols-3 border-y border-[#e4e6eb] py-1">
                <div className="group relative">
                    <ReactionPicker onPick={onReact} />
                    <button type="button" onClick={() => onReact(post.mineReaction === "like" ? "love" : "like")} className={cx("flex h-9 w-full items-center justify-center gap-2 rounded-md text-[15px] font-semibold transition duration-200 hover:bg-[#f2f2f2]", activeReaction ? activeReaction.color : "text-[#65676b]")}>
                        <span>{activeReaction?.icon || "👍"}</span>
                        {activeReaction?.label || "Thích"}
                    </button>
                </div>
                <button type="button" onClick={onOpen} className="flex h-9 items-center justify-center gap-2 rounded-md text-[15px] font-semibold text-[#65676b] transition duration-200 hover:bg-[#f2f2f2]">
                    <MessageCircle size={20} />
                    Bình luận
                </button>
                <button type="button" onClick={onShare} className="flex h-9 items-center justify-center gap-2 rounded-md text-[15px] font-semibold text-[#65676b] transition duration-200 hover:bg-[#f2f2f2]">
                    <Share2 size={20} />
                    Chia sẻ
                </button>
            </div>
        </div>
    );
}

function CommentList(props: {
    post: Post;
    comments: CommentNode[];
    depth: number;
    commentDrafts: Record<string, string>;
    setCommentDrafts: Dispatch<SetStateAction<Record<string, string>>>;
    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    onAddComment: (postId: number, parentId?: number) => void;
    onReactComment: (postId: number, commentId: number, reaction: ReactionKey) => void;
}) {
    return (
        <div className={cx("space-y-2", props.depth > 1 && "ml-8 border-l-2 border-[#e4e6eb] pl-3 sm:ml-10")}>
            {props.comments.map((comment) => (
                <div key={comment.id}>
                    <div className="flex items-start gap-2">
                        <Avatar label={comment.avatar} className="h-8 w-8 bg-slate-300" />
                        <div className="min-w-0">
                            <div className="relative inline-block rounded-[18px] bg-[#f0f2f5] px-3 py-2">
                                <p className="text-[13px] font-bold">{comment.author}</p>
                                <p className="text-[15px] leading-5">{comment.text}</p>
                                {reactionTotal(comment.reactions) > 0 && (
                                    <span className="absolute -bottom-3 right-2 flex items-center gap-0.5 rounded-full bg-white px-1 py-0.5 text-[12px] shadow">
                                        <ReactionBadge reactionMap={comment.reactions} />
                                        {reactionTotal(comment.reactions)}
                                    </span>
                                )}
                            </div>
                            <div className="ml-3 mt-1 flex items-center gap-3 text-[13px] font-bold text-[#65676b]">
                                <span>{comment.time}</span>
                                <span className="group relative">
                                    <ReactionPicker onPick={(reaction) => props.onReactComment(props.post.id, comment.id, reaction)} />
                                    <button type="button" className={comment.mineReaction ? reactions.find((reaction) => reaction.key === comment.mineReaction)?.color : "hover:underline"}>
                                        {comment.mineReaction ? reactions.find((reaction) => reaction.key === comment.mineReaction)?.label : "Thích"}
                                    </button>
                                </span>
                                {props.depth < 3 && (
                                    <button type="button" onClick={() => props.setReplyingTo(comment.id)} className="hover:underline">
                                        Trả lời
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    {props.replyingTo === comment.id && (
                        <div className="ml-10 mt-2">
                            <CommentInput postId={props.post.id} parentId={comment.id} commentDrafts={props.commentDrafts} setCommentDrafts={props.setCommentDrafts} onAddComment={props.onAddComment} placeholder={`Trả lời ${comment.author}`} />
                        </div>
                    )}
                    {comment.replies && comment.replies.length > 0 && <CommentList {...props} comments={comment.replies} depth={props.depth + 1} />}
                </div>
            ))}
        </div>
    );
}

function CommentInput({
    postId,
    parentId,
    commentDrafts,
    setCommentDrafts,
    onAddComment,
    placeholder = "Viết bình luận...",
}: {
    postId: number;
    parentId?: number;
    commentDrafts: Record<string, string>;
    setCommentDrafts: Dispatch<SetStateAction<Record<string, string>>>;
    onAddComment: (postId: number, parentId?: number) => void;
    placeholder?: string;
}) {
    const key = parentId ? `${postId}-${parentId}` : `${postId}`;
    return (
        <div className="mt-2 flex items-center gap-2">
            {!parentId && <Avatar label={currentUser.avatar} className="h-8 w-8 bg-[linear-gradient(135deg,#111827,#60a5fa)] text-white" />}
            <div className="flex min-h-9 flex-1 items-center gap-2 rounded-[18px] bg-[#f0f2f5] px-3 py-1.5 transition focus-within:ring-2 focus-within:ring-[#1877f2]/20">
                <input
                    value={commentDrafts[key] || ""}
                    onChange={(event) => setCommentDrafts((current) => ({ ...current, [key]: event.target.value }))}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onAddComment(postId, parentId);
                    }}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
                />
                <Camera size={17} className="text-[#65676b]" />
                <Laugh size={17} className="text-[#65676b]" />
                <button type="button" onClick={() => onAddComment(postId, parentId)} className="text-[#65676b] transition hover:text-[#1877f2]" aria-label="Gửi bình luận">
                    <Send size={17} />
                </button>
            </div>
        </div>
    );
}

export function PostModal(props: {
    post: Post;
    onClose: () => void;
    onReact: (reaction: ReactionKey) => void;
    onShare: () => void;
    onToggleSaved: () => void;
    commentDrafts: Record<string, string>;
    setCommentDrafts: Dispatch<SetStateAction<Record<string, string>>>;
    replyingTo: number | null;
    setReplyingTo: (id: number | null) => void;
    onAddComment: (postId: number, parentId?: number) => void;
    onReactComment: (postId: number, commentId: number, reaction: ReactionKey) => void;
}) {
    const activeReaction = reactions.find((reaction) => reaction.key === props.post.mineReaction);
    return (
        <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-[2px]">
            <button type="button" onClick={props.onClose} className="fixed left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e6eb] transition hover:bg-[#d8dadf]" aria-label="Đóng">
                <X size={24} />
            </button>
            <div className="mx-auto mt-8 flex h-[calc(100vh-64px)] w-[min(760px,calc(100vw-24px))] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
                <div className="relative flex h-[60px] shrink-0 items-center justify-center border-b border-[#e4e6eb]">
                    <h2 className="truncate px-16 text-xl font-bold">Bài viết của {props.post.author}</h2>
                    <button type="button" onClick={props.onClose} className="absolute right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb] transition hover:bg-[#d8dadf]" aria-label="Đóng">
                        <X size={22} />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <PostHeader post={props.post} onToggleSaved={props.onToggleSaved} />
                    <div className="px-3 pb-3">
                        <p className="whitespace-pre-line text-[15px] leading-6">{props.post.content}</p>
                    </div>
                    <SocialImage variant={props.post.image} compact />
                    <PostActions post={props.post} onOpen={() => undefined} onReact={props.onReact} onShare={props.onShare} activeReaction={activeReaction} />
                    <div className="px-3 pb-4">
                        <button type="button" className="mb-3 flex items-center gap-1 text-[15px] font-semibold text-[#65676b]">
                            Phù hợp nhất <ChevronDown size={16} />
                        </button>
                        <CommentList post={props.post} comments={props.post.comments} depth={1} commentDrafts={props.commentDrafts} setCommentDrafts={props.setCommentDrafts} replyingTo={props.replyingTo} setReplyingTo={props.setReplyingTo} onAddComment={props.onAddComment} onReactComment={props.onReactComment} />
                    </div>
                </div>
                <div className="shrink-0 border-t border-[#e4e6eb] bg-white p-3">
                    <CommentInput postId={props.post.id} commentDrafts={props.commentDrafts} setCommentDrafts={props.setCommentDrafts} onAddComment={props.onAddComment} placeholder={`Bình luận dưới tên ${currentUser.name}`} />
                </div>
            </div>
        </div>
    );
}
