import { MessageCircle, Sparkles, Users, Video } from "lucide-react";

import { COMMUNITY_CHANNELS, NOIBO_COMMUNITY_HIGHLIGHTS } from "@/components/noibo/noibo-data";
import {
  NoiboCardGrid,
  NoiboPageHero,
  NoiboSection,
  NoiboTimeline,
} from "@/components/noibo/noibo-page-shell";

export default function NoiboCommunityPage() {
  return (
    <div className="bg-[#f8fafc] pb-24">
      <NoiboPageHero
        eyebrow="Teacher Community"
        title="Cộng đồng nội bộ để giáo viên cùng nâng chất lượng bài dạy."
        description="Không gian trao đổi dành riêng cho đội ngũ ERG, nơi bài giảng được review, câu hỏi được giải đáp nhanh và kinh nghiệm lớp học được lưu lại thành tài nguyên sống."
        stats={[
          { label: "Kênh hoạt động", value: `${COMMUNITY_CHANNELS.length}` },
          { label: "Mentor trực", value: "12" },
          { label: "Chủ đề nổi bật", value: "Q&A / Review / Sharing" },
        ]}
        actions={[
          { label: "Mở portfolio", href: "/portfolio", icon: Users },
          { label: "Xem quiz bank", href: "/quizzes", icon: Sparkles, variant: "secondary" },
        ]}
      />

      <NoiboSection
        eyebrow="Channels"
        title="Các kênh cộng đồng đang hoạt động nhiều nhất."
        description="Mỗi kênh phục vụ một nhu cầu thật trong vận hành giảng dạy, từ xin review giáo án đến xử lý case khó trên lớp."
      >
        <NoiboCardGrid
          items={COMMUNITY_CHANNELS.map((channel) => ({
            title: channel.title,
            description: channel.summary,
            meta: channel.cadence,
            href: channel.href,
          }))}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Highlights"
        title="Những nội dung cộng đồng nên khai thác thường xuyên."
        description="Đây là các dòng thảo luận quan trọng để hệ thống tri thức trong Teacher Hub không bị nằm chết ở từng cá nhân."
        tone="muted"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {NOIBO_COMMUNITY_HIGHLIGHTS.map((item, index) => (
            <div key={item} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/30">
              <p className="text-4xl font-black text-[#00008b]/12">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-4 text-2xl font-black leading-tight text-slate-900">{item}</p>
            </div>
          ))}
        </div>
      </NoiboSection>

      <NoiboSection
        eyebrow="Participation Flow"
        title="Cách tham gia cộng đồng để nhận giá trị thật."
        description="Mình đóng flow này như một quy trình rất cụ thể để giáo viên không chỉ vào đọc mà còn tạo ra thêm tri thức dùng được cho cả đội."
      >
        <NoiboTimeline
          items={[
            {
              title: "Đăng case hoặc câu hỏi",
              detail: "Mô tả rõ bối cảnh lớp học, objective đang dạy và vướng mắc đang gặp để mọi người hỗ trợ đúng trọng tâm.",
              meta: "Ask",
            },
            {
              title: "Nhận phản hồi từ mentor",
              detail: "Mentor hoặc giáo viên khác góp ý dựa trên tài nguyên sẵn có, kinh nghiệm triển khai và cách xử lý đã thử.",
              meta: "Review",
            },
            {
              title: "Đóng gói lại thành tài nguyên",
              detail: "Khi đã có lời giải tốt, nội dung được đưa ngược về portfolio hoặc kho học liệu để dùng lâu dài.",
              meta: "Archive",
            },
          ]}
        />
      </NoiboSection>

      <NoiboSection
        eyebrow="Formats"
        title="Cộng đồng không chỉ là bình luận văn bản."
        description="Ngoài thread trao đổi, đội ngũ còn có nhiều hình thức cộng tác khác để bài giảng được cải thiện nhanh hơn."
        tone="dark"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: "Text threads", detail: "Thảo luận nhanh theo topic, có gắn file và ảnh chụp lớp học.", icon: MessageCircle },
            { title: "Video review", detail: "Review deck hoặc demo bài giảng qua recording ngắn để phản hồi trực diện.", icon: Video },
            { title: "Weekly spotlight", detail: "Chọn các bài giảng hay nhất tuần để lan tỏa cách làm tốt cho toàn đội.", icon: Sparkles },
          ].map((item) => {
            const ItemIcon = item.icon;
            return (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <ItemIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-2xl font-black tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{item.detail}</p>
              </div>
            );
          })}
        </div>
      </NoiboSection>
    </div>
  );
}
