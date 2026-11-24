import { Bookmark, Compass, Film, Flame, Gift, Home, MonitorPlay, ShieldCheck, Store, UserRound, UsersRound } from "lucide-react"
import type { Post, ReactionKey } from "./forum-social-types"

export const currentUser = {
    name: "Minh Anh",
    avatar: "MA",
};

export const reactions: Array<{ key: ReactionKey; label: string; icon: string; color: string }> = [
    { key: "like", label: "Thích", icon: "👍", color: "text-[#1877f2]" },
    { key: "love", label: "Yêu thích", icon: "❤️", color: "text-[#f3425f]" },
    { key: "care", label: "Thương thương", icon: "🥰", color: "text-[#f7b928]" },
    { key: "haha", label: "Haha", icon: "😆", color: "text-[#f7b928]" },
    { key: "wow", label: "Wow", icon: "😮", color: "text-[#f7b928]" },
    { key: "sad", label: "Buồn", icon: "😢", color: "text-[#f7b928]" },
    { key: "angry", label: "Phẫn nộ", icon: "😡", color: "text-[#e9710f]" },
];

export const navItems = [
    { label: "Bảng tin", icon: Home },
    { label: "Video", icon: MonitorPlay },
    { label: "Nhóm", icon: UsersRound },
    { label: "Khám phá", icon: Compass },
    { label: "Đã lưu", icon: Bookmark },
];

export const leftItems = [
    { label: currentUser.name, icon: UserRound, avatar: true },
    { label: "Bảng tin của tôi", icon: Flame },
    { label: "Nhóm đang theo dõi", icon: UsersRound },
    { label: "Bài viết đã lưu", icon: Bookmark },
    { label: "Sự kiện cộng đồng", icon: Gift },
    { label: "Marketplace", icon: Store },
    { label: "Quản trị bài đăng", icon: ShieldCheck },
    { label: "Thước phim", icon: Film },
];

export const shortcuts = [
    "Frontend Việt Nam",
    "Cộng đồng AI Agents Việt Nam",
    "Hội chia sẻ việc làm IT",
    "Góc review laptop",
    "Nhóm học tiếng Anh mỗi ngày",
];

export const stories = [
    { name: "Tạo tin", avatar: currentUser.avatar, color: "from-blue-500 to-sky-300", mine: true },
    { name: "Lan Hương", avatar: "LH", color: "from-rose-400 to-orange-300" },
    { name: "Tuấn Kiệt", avatar: "TK", color: "from-violet-500 to-indigo-300" },
    { name: "Bảo Ngọc", avatar: "BN", color: "from-emerald-500 to-lime-300" },
];

export const trends = [
    { title: "Góc hỏi đáp nghề nghiệp", meta: "1.284 bài viết hôm nay" },
    { title: "AI trong công việc văn phòng", meta: "Đang thảo luận mạnh" },
    { title: "Review khóa học và tài liệu", meta: "428 bình luận mới" },
];

export const seedPosts: Post[] = [
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
