"use client";

import type { Dispatch, SetStateAction } from "react";
import { useMemo, useState } from "react";
import {
    Bell,
    Bookmark,
    Camera,
    ChevronDown,
    CircleUserRound,
    Compass,
    Ellipsis,
    Film,
    Flame,
    Flag,
    Gift,
    Grid3X3,
    Home,
    Image as ImageIcon,
    Laugh,
    MessageCircle,
    MonitorPlay,
    Plus,
    Search,
    Send,
    Share2,
    ShieldCheck,
    Sparkles,
    Store,
    UserPlus,
    UserRound,
    UsersRound,
    X,
} from "lucide-react";

type ReactionKey = "like" | "love" | "care" | "haha" | "wow" | "sad" | "angry";

type CommentNode = {
    id: number;
    author: string;
    avatar: string;
    text: string;
    time: string;
    reactions: Partial<Record<ReactionKey, number>>;
    mineReaction?: ReactionKey;
    replies?: CommentNode[];
};

type Post = {
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

const currentUser = {
    name: "Minh Anh",
    avatar: "MA",
};

const reactions: Array<{ key: ReactionKey; label: string; icon: string; color: string }> = [
    { key: "like", label: "Thích", icon: "👍", color: "text-[#1877f2]" },
    { key: "love", label: "Yêu thích", icon: "❤️", color: "text-[#f3425f]" },
    { key: "care", label: "Thương thương", icon: "🥰", color: "text-[#f7b928]" },
    { key: "haha", label: "Haha", icon: "😆", color: "text-[#f7b928]" },
    { key: "wow", label: "Wow", icon: "😮", color: "text-[#f7b928]" },
    { key: "sad", label: "Buồn", icon: "😢", color: "text-[#f7b928]" },
    { key: "angry", label: "Phẫn nộ", icon: "😡", color: "text-[#e9710f]" },
];

const navItems = [
    { label: "Bảng tin", icon: Home },
    { label: "Video", icon: MonitorPlay },
    { label: "Nhóm", icon: UsersRound },
    { label: "Khám phá", icon: Compass },
    { label: "Đã lưu", icon: Bookmark },
];

const leftItems = [
    { label: currentUser.name, icon: UserRound, avatar: true },
    { label: "Bảng tin của tôi", icon: Flame },
    { label: "Nhóm đang theo dõi", icon: UsersRound },
    { label: "Bài viết đã lưu", icon: Bookmark },
    { label: "Sự kiện cộng đồng", icon: Gift },
    { label: "Marketplace", icon: Store },
    { label: "Quản trị bài đăng", icon: ShieldCheck },
    { label: "Thước phim", icon: Film },
];

const shortcuts = [
    "Frontend Việt Nam",
    "Cộng đồng AI Agents Việt Nam",
    "Hội chia sẻ việc làm IT",
    "Góc review laptop",
    "Nhóm học tiếng Anh mỗi ngày",
];

const stories = [
    { name: "Tạo tin", avatar: currentUser.avatar, color: "from-blue-500 to-sky-300", mine: true },
    { name: "Lan Hương", avatar: "LH", color: "from-rose-400 to-orange-300" },
    { name: "Tuấn Kiệt", avatar: "TK", color: "from-violet-500 to-indigo-300" },
    { name: "Bảo Ngọc", avatar: "BN", color: "from-emerald-500 to-lime-300" },
];

const trends = [
    { title: "Góc hỏi đáp nghề nghiệp", meta: "1.284 bài viết hôm nay" },
    { title: "AI trong công việc văn phòng", meta: "Đang thảo luận mạnh" },
    { title: "Review khóa học và tài liệu", meta: "428 bình luận mới" },
];

const seedPosts: Post[] = [
    {
        id: 1,
        author: "Ngọc Linh",
        avatar: "NL",
        time: "12 phút",
        group: "Frontend Việt Nam",
        content:
            "Mọi người thường tổ chức component cho dashboard lớn như thế nào để sau này không bị rối? Mình đang tách theo feature, nhưng phần table/filter/modal bắt đầu dùng chung khá nhiều.",
        image: "discussion",
        tags: ["React", "Dashboard", "Clean code"],
        reactions: { like: 128, love: 24, care: 8 },
        comments: [
            {
                id: 101,
                author: "Hoàng Nam",
                avatar: "HN",
                text: "Mình hay tách feature trước, phần nào lặp lại 2-3 lần mới đưa vào shared. Đỡ bị over-engineer.",
                time: "8 phút",
                reactions: { like: 16, love: 2 },
                replies: [
                    {
                        id: 102,
                        author: "Ngọc Linh",
                        avatar: "NL",
                        text: "Chuẩn, chắc mình đang đưa vào shared hơi sớm.",
                        time: "6 phút",
                        reactions: { like: 5 },
                        replies: [
                            {
                                id: 103,
                                author: "Mai Phương",
                                avatar: "MP",
                                text: "Có thể đặt rule rõ: shared chỉ chứa UI không biết business logic.",
                                time: "3 phút",
                                reactions: { care: 2 },
                            },
                        ],
                    },
                ],
            },
            {
                id: 104,
                author: "Quang Huy",
                avatar: "QH",
                text: "Table/filter nên có hook riêng cho state, còn UI để component nhận props là ổn.",
                time: "5 phút",
                reactions: { like: 9 },
            },
        ],
        shares: 11,
    },
    {
        id: 2,
        author: "Anh Khoa",
        avatar: "AK",
        time: "1 giờ",
        group: "Cộng đồng AI Agents Việt Nam",
        content:
            "Mình thử dùng AI để tóm tắt meeting notes rồi đẩy thành checklist. Cái khó nhất không phải prompt, mà là làm sao để output đủ ngắn cho team thật sự đọc.",
        image: "workspace",
        tags: ["AI", "Productivity", "Workflow"],
        reactions: { like: 260, wow: 31, love: 18 },
        comments: [
            {
                id: 201,
                author: "Thanh Vân",
                avatar: "TV",
                text: "Đúng quá. Mình hay bắt nó chia thành Quyết định, Việc cần làm, Rủi ro.",
                time: "42 phút",
                reactions: { love: 7 },
            },
            {
                id: 202,
                author: "Đức Minh",
                avatar: "DM",
                text: "Có template nào ổn không bạn?",
                time: "28 phút",
                reactions: { like: 3 },
                replies: [
                    {
                        id: 203,
                        author: "Anh Khoa",
                        avatar: "AK",
                        text: "Mình để mock thêm ở comment sau nhé.",
                        time: "22 phút",
                        reactions: { like: 4 },
                    },
                ],
            },
        ],
        shares: 19,
        saved: true,
    },
    {
        id: 3,
        author: "Thu Hà",
        avatar: "TH",
        time: "Hôm qua",
        group: "Nhóm học tiếng Anh mỗi ngày",
        content:
            "Poll nhẹ: nếu chỉ có 30 phút mỗi tối, mọi người ưu tiên nghe podcast, đọc bài ngắn hay luyện nói theo shadowing?",
        image: "poll",
        tags: ["Poll", "Learning", "Daily habit"],
        reactions: { like: 88, haha: 5, care: 12 },
        comments: [
            { id: 301, author: "Gia Bảo", avatar: "GB", text: "Shadowing 15 phút + đọc 15 phút là vừa.", time: "20 giờ", reactions: { like: 6 } },
        ],
        shares: 4,
    },
];

function cx(...classes: Array<string | false | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function reactionTotal(reactionMap: Partial<Record<ReactionKey, number>>) {
    return Object.values(reactionMap).reduce((sum, value) => sum + (value || 0), 0);
}

function countComments(comments: CommentNode[]): number {
    return comments.reduce((sum, comment) => sum + 1 + countComments(comment.replies || []), 0);
}

function topReactionIcons(reactionMap: Partial<Record<ReactionKey, number>>) {
    return reactions
        .filter((reaction) => reactionMap[reaction.key])
        .sort((a, b) => (reactionMap[b.key] || 0) - (reactionMap[a.key] || 0))
        .slice(0, 3);
}

function findComment(nodes: CommentNode[], id: number): CommentNode | undefined {
    for (const node of nodes) {
        if (node.id === id) return node;
        const found = node.replies ? findComment(node.replies, id) : undefined;
        if (found) return found;
    }
}

function updateCommentTree(nodes: CommentNode[], id: number, updater: (node: CommentNode) => CommentNode): CommentNode[] {
    return nodes.map((node) => {
        if (node.id === id) return updater(node);
        if (!node.replies) return node;
        return { ...node, replies: updateCommentTree(node.replies, id, updater) };
    });
}

function getDepth(nodes: CommentNode[], id: number, depth = 1): number {
    for (const node of nodes) {
        if (node.id === id) return depth;
        const found = node.replies ? getDepth(node.replies, id, depth + 1) : 0;
        if (found) return found;
    }
    return 0;
}

function Avatar({ label, className }: { label: string; className?: string }) {
    return (
        <div className={cx("flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-[12px] font-bold text-slate-700 ring-1 ring-black/5", className)}>
            {label}
        </div>
    );
}

function ReactionBadge({ reactionMap }: { reactionMap: Partial<Record<ReactionKey, number>> }) {
    const icons = topReactionIcons(reactionMap);
    return (
        <span className="flex items-center">
            {icons.map((reaction, index) => (
                <span key={reaction.key} className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-white text-[13px] shadow-sm" style={{ marginLeft: index ? -5 : 0 }}>
                    {reaction.icon}
                </span>
            ))}
        </span>
    );
}

function ReactionPicker({ onPick }: { onPick: (reaction: ReactionKey) => void }) {
    return (
        <div className="pointer-events-none absolute bottom-full left-0 z-20 mb-2 flex translate-y-2 gap-1 rounded-full bg-white px-2 py-1.5 opacity-0 shadow-[0_8px_24px_rgba(15,23,42,0.22)] ring-1 ring-black/5 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            {reactions.map((reaction, index) => (
                <button
                    key={reaction.key}
                    type="button"
                    className="h-10 w-10 rounded-full text-[28px] transition duration-150 hover:-translate-y-2 hover:scale-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1877f2]"
                    style={{ transitionDelay: `${index * 18}ms` }}
                    onClick={() => onPick(reaction.key)}
                    aria-label={reaction.label}
                >
                    {reaction.icon}
                </button>
            ))}
        </div>
    );
}

function SocialImage({ variant, compact = false }: { variant: Post["image"]; compact?: boolean }) {
    if (variant === "discussion") {
        return (
            <div className={cx("relative overflow-hidden bg-[#dfe8fb]", compact ? "h-[230px]" : "h-[380px]")}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(24,119,242,0.18),transparent_24%),radial-gradient(circle_at_78%_30%,rgba(34,197,94,0.18),transparent_28%),linear-gradient(135deg,#eff6ff,#f8fafc)]" />
                <div className="absolute left-[8%] top-[16%] w-[48%] rounded-2xl bg-white p-5 shadow-xl">
                    <div className="mb-3 h-3 w-28 rounded-full bg-slate-200" />
                    <div className="space-y-2">
                        <div className="h-3 rounded-full bg-blue-100" />
                        <div className="h-3 w-5/6 rounded-full bg-blue-100" />
                        <div className="h-3 w-3/5 rounded-full bg-blue-100" />
                    </div>
                </div>
                <div className="absolute bottom-[14%] right-[8%] w-[42%] rounded-2xl bg-[#1877f2] p-5 text-white shadow-xl">
                    <p className="text-lg font-bold">Thảo luận nổi bật</p>
                    <p className="mt-2 text-sm text-white/85">Hỏi nhanh, trả lời gọn, lưu lại khi cần.</p>
                </div>
            </div>
        );
    }

    if (variant === "poll") {
        return (
            <div className={cx("bg-white px-5 py-5", compact ? "min-h-[220px]" : "min-h-[300px]")}>
                {["Nghe podcast", "Đọc bài ngắn", "Shadowing"].map((label, index) => (
                    <div key={label} className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold">
                            <span>{label}</span>
                            <span>{[34, 22, 44][index]}%</span>
                        </div>
                        <div className="h-2 bg-slate-100">
                            <div className="h-full rounded-r-full bg-[#1877f2]" style={{ width: `${[34, 22, 44][index]}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={cx("relative overflow-hidden bg-[linear-gradient(135deg,#0f172a,#2563eb_48%,#c7d2fe)]", compact ? "h-[230px]" : "h-[360px]")}>
            <div className="absolute inset-x-[8%] bottom-[14%] rounded-2xl bg-white/92 p-5 shadow-2xl backdrop-blur">
                <p className="text-xl font-black text-slate-950">Workflow gọn hơn mỗi ngày</p>
                <p className="mt-2 text-sm text-slate-600">Một ví dụ mock cho bài viết dạng chia sẻ kinh nghiệm.</p>
            </div>
        </div>
    );
}

export function ForumSocialApp() {
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

    return (
        <div className="min-h-screen bg-[#eef0f4] text-[#050505] [font-family:'Be_Vietnam_Pro','Noto_Sans',system-ui,sans-serif]">
            <TopBar />

            <div className="relative mx-auto max-w-[1920px] pt-14">
                <LeftRail />

                <main className="min-h-screen w-full max-w-[720px] space-y-3 px-2 pb-10 pt-4 sm:px-0 lg:ml-[360px] lg:max-w-[680px] xl:max-w-[720px] 2xl:mx-auto 2xl:ml-auto">
                    <StoryStrip />
                    <Composer value={composerText} onChange={setComposerText} onSubmit={createPost} />
                    <FeedTabs />
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onOpen={() => setActivePostId(post.id)}
                            onReact={(reaction) => reactToPost(post.id, reaction)}
                            onShare={() => sharePost(post.id)}
                            onToggleSaved={() => toggleSaved(post.id)}
                            commentDrafts={commentDrafts}
                            setCommentDrafts={setCommentDrafts}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            onAddComment={addComment}
                            onReactComment={reactToComment}
                        />
                    ))}
                </main>

                <RightRail />
            </div>

            {activePost && (
                <PostModal
                    post={activePost}
                    onClose={() => setActivePostId(null)}
                    onReact={(reaction) => reactToPost(activePost.id, reaction)}
                    onShare={() => sharePost(activePost.id)}
                    onToggleSaved={() => toggleSaved(activePost.id)}
                    commentDrafts={commentDrafts}
                    setCommentDrafts={setCommentDrafts}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    onAddComment={addComment}
                    onReactComment={reactToComment}
                />
            )}
        </div>
    );
}

function TopBar() {
    return (
        <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#d8dbe1] bg-white px-3 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-[21px] font-black leading-none text-white">F</div>
                <div className="hidden h-10 w-[260px] items-center gap-2 rounded-full bg-[#f0f2f5] px-3 text-[#65676b] transition focus-within:ring-2 focus-within:ring-[#1877f2]/25 md:flex">
                    <Search size={18} />
                    <input className="min-w-0 flex-1 bg-transparent text-[15px] outline-none" placeholder="Tìm kiếm trong cộng đồng" />
                </div>
            </div>

            <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-1 md:flex">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.label} type="button" className={cx("relative flex h-full w-[96px] items-center justify-center rounded-lg text-[#65676b] transition duration-200 hover:bg-[#f2f2f2] xl:w-[112px]", index === 0 && "text-[#1877f2]")} title={item.label}>
                            <Icon size={25} />
                            {index === 0 && <span className="absolute bottom-0 h-[3px] w-full rounded-t bg-[#1877f2]" />}
                        </button>
                    );
                })}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2">
                {[Grid3X3, MessageCircle, Bell].map((Icon, index) => (
                    <button key={index} type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#e4e6eb] transition duration-200 hover:bg-[#d8dadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1877f2]">
                        <Icon size={20} />
                        {index === 2 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e41e3f] px-1 text-[12px] font-bold text-white">3</span>}
                    </button>
                ))}
                <Avatar label={currentUser.avatar} className="h-10 w-10 bg-[linear-gradient(135deg,#0f172a,#60a5fa)] text-white" />
            </div>
        </header>
    );
}

function LeftRail() {
    return (
        <aside className="fixed left-0 top-14 hidden h-[calc(100vh-56px)] w-[340px] overflow-y-auto px-2 py-4 lg:block xl:w-[360px]">
            <div className="space-y-1">
                {leftItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.label} type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                            {item.avatar ? <Avatar label={currentUser.avatar} className="h-9 w-9 bg-[linear-gradient(135deg,#111827,#60a5fa)] text-white" /> : <Icon size={27} className="text-[#1877f2]" />}
                            <span>{item.label}</span>
                        </button>
                    );
                })}
                <button type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4e6eb]">
                        <ChevronDown size={18} />
                    </span>
                    Xem thêm
                </button>
            </div>

            <div className="my-3 h-px bg-[#ced0d4]" />
            <h2 className="px-2 pb-2 text-[17px] font-bold text-[#65676b]">Lối tắt của bạn</h2>
            <div className="space-y-1">
                {shortcuts.map((shortcut, index) => (
                    <button key={shortcut} type="button" className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-[15px] font-semibold transition duration-200 hover:bg-[#e4e6eb]">
                        <Avatar label={shortcut.slice(0, 2).toUpperCase()} className={cx("h-9 w-9 text-[10px]", index % 2 ? "bg-slate-200" : "bg-sky-100")} />
                        <span className="line-clamp-2">{shortcut}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}

function RightRail() {
    return (
        <aside className="fixed right-[max(16px,calc((100vw-1920px)/2+24px))] top-14 hidden h-[calc(100vh-56px)] w-[360px] overflow-y-auto px-3 py-5 2xl:block">
            <section className="rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#65676b]">Đang nổi bật</h2>
                    <button type="button" className="text-[14px] font-semibold text-[#1877f2]">Làm mới</button>
                </div>
                <div className="space-y-1">
                    {trends.map((trend, index) => (
                        <button key={trend.title} type="button" className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition duration-200 hover:bg-[#f2f2f2]">
                            <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">{index + 1}</span>
                            <span>
                                <span className="block font-semibold leading-5">{trend.title}</span>
                                <span className="block text-[13px] text-[#65676b]">{trend.meta}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-[17px] font-bold text-[#65676b]">Gợi ý kết nối</h2>
                    <button type="button" className="text-[14px] font-semibold text-[#1877f2]">Xem tất cả</button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: "Bảo Trân", avatar: "BT", mutual: "7 bạn chung" },
                        { name: "Minh Quân", avatar: "MQ", mutual: "Cùng 3 nhóm" },
                    ].map((person) => (
                        <div key={person.name} className="flex items-center gap-3 rounded-lg p-2 transition duration-200 hover:bg-[#f2f2f2]">
                            <Avatar label={person.avatar} className="h-13 w-13 bg-slate-300" />
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{person.name}</p>
                                <p className="text-[13px] text-[#65676b]">{person.mutual}</p>
                                <div className="mt-2 flex gap-2">
                                    <button type="button" className="rounded-md bg-[#1877f2] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#166fe5]">Kết nối</button>
                                    <button type="button" className="rounded-md bg-[#e4e6eb] px-4 py-2 text-sm font-bold transition hover:bg-[#d8dadf]">Ẩn</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-3 rounded-xl bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-[17px] font-bold text-[#65676b]">Đang hoạt động</h2>
                <div className="grid grid-cols-5 gap-2">
                    {["LH", "TK", "BN", "HN", "TV", "QH", "MP", "AK", "TH", "GB"].map((avatar) => (
                        <div key={avatar} className="relative">
                            <Avatar label={avatar} className="h-10 w-10 bg-slate-200" />
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#31a24c]" />
                        </div>
                    ))}
                </div>
            </section>
        </aside>
    );
}

function StoryStrip() {
    return (
        <section className="grid grid-cols-4 gap-2">
            {stories.map((story) => (
                <button key={story.name} type="button" className={cx("relative h-[150px] overflow-hidden rounded-xl bg-gradient-to-br p-3 text-left text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md", story.color)}>
                    <Avatar label={story.avatar} className="h-10 w-10 border-2 border-white bg-white/90 text-slate-700" />
                    {story.mine && (
                        <span className="absolute left-10 top-10 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#1877f2]">
                            <Plus size={15} />
                        </span>
                    )}
                    <span className="absolute inset-x-3 bottom-3 text-[13px] font-bold leading-4 drop-shadow">{story.name}</span>
                </button>
            ))}
        </section>
    );
}

function FeedTabs() {
    return (
        <section className="grid grid-cols-3 rounded-xl bg-white p-1 shadow-sm">
            {["Dành cho bạn", "Đang theo dõi", "Mới nhất"].map((label, index) => (
                <button key={label} type="button" className={cx("h-10 rounded-lg text-[14px] font-bold transition duration-200", index === 0 ? "bg-[#e7f3ff] text-[#1877f2]" : "text-[#65676b] hover:bg-[#f2f2f2]")}>
                    {label}
                </button>
            ))}
        </section>
    );
}

function Composer({ value, onChange, onSubmit }: { value: string; onChange: (value: string) => void; onSubmit: () => void }) {
    return (
        <section className="rounded-xl bg-white p-3 shadow-sm">
            <div className="flex gap-2">
                <Avatar label={currentUser.avatar} className="bg-[linear-gradient(135deg,#111827,#60a5fa)] text-white" />
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") onSubmit();
                    }}
                    placeholder={`${currentUser.name} ơi, bạn muốn chia sẻ gì?`}
                    className="h-10 min-w-0 flex-1 rounded-full bg-[#f0f2f5] px-4 text-[15px] outline-none transition hover:bg-[#e4e6eb] focus:bg-[#e4e6eb] focus:ring-2 focus:ring-[#1877f2]/20"
                />
                <button type="button" onClick={onSubmit} className="rounded-full bg-[#1877f2] px-4 text-sm font-bold text-white transition duration-200 hover:bg-[#166fe5] disabled:opacity-50" disabled={!value.trim()}>
                    Đăng
                </button>
            </div>
            <div className="mt-3 grid grid-cols-3 border-t border-[#e4e6eb] pt-2">
                {[
                    ["Video trực tiếp", Film, "text-[#f3425f]"],
                    ["Ảnh/video", ImageIcon, "text-[#45bd62]"],
                    ["Cảm xúc", Laugh, "text-[#f7b928]"],
                ].map(([label, Icon, color]) => {
                    const ActionIcon = Icon as typeof Film;
                    return (
                        <button key={String(label)} type="button" className="flex h-10 items-center justify-center gap-2 rounded-lg text-[15px] font-semibold text-[#65676b] transition duration-200 hover:bg-[#f2f2f2]">
                            <ActionIcon size={22} className={String(color)} />
                            <span className="hidden sm:inline">{String(label)}</span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

function PostCard(props: {
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

function PostModal(props: {
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
