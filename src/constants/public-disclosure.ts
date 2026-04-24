export interface DisclosureCoverConfig {
  eyebrow: string;
  issuedBy: string;
  title: string;
  subtitle: string;
  footer: string;
}

export interface DisclosureDocument {
  sectionSlug: string;
  slug: string;
  title: string;
  menuLabel: string;
  shortDescription: string;
  description: string;
  publishedAt: string;
  effectiveDate: string;
  referenceCode: string;
  issuingAuthority: string;
  reviewCycle: string;
  accessScope: string;
  heroKicker: string;
  highlights: string[];
  detailBlocks: Array<{
    heading: string;
    body: string;
  }>;
  cover: DisclosureCoverConfig;
  documentId?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  schoolYear?: string;
}

export interface DisclosureSection {
  slug: string;
  label: string;
  description: string;
  accent: string;
  documents: DisclosureDocument[];
}

const disclosureSections: DisclosureSection[] = [
  {
    slug: "phap-ly",
    label: "Pháp lý",
    description:
      "Công bố các hồ sơ xác nhận phạm vi hoạt động, năng lực vận hành chi nhánh và các chứng từ pháp lý liên quan.",
    accent: "from-amber-100 via-orange-50 to-white",
    documents: [
      {
        sectionSlug: "phap-ly",
        slug: "chung-nhan-hoat-dong-chi-nhanh",
        title: "Chứng nhận hoạt động chi nhánh",
        menuLabel: "Chứng nhận hoạt động chi nhánh",
        shortDescription:
          "Bản công khai giấy chứng nhận cho phép chi nhánh ERG triển khai hoạt động đào tạo và dịch vụ hỗ trợ tại địa điểm đăng ký.",
        description:
          "Tài liệu xác nhận tình trạng pháp lý của chi nhánh, phạm vi hoạt động được phê duyệt và thông tin cơ bản phục vụ đối chiếu công khai.",
        publishedAt: "2026-01-15",
        effectiveDate: "2026-01-15",
        referenceCode: "ERG/PL-01/2026",
        issuingAuthority: "Ban Pháp chế và Điều hành Edurise Global",
        reviewCycle: "Rà soát khi có thay đổi giấy phép hoặc thông tin địa điểm",
        accessScope: "Công khai trên cổng thông tin chính thức",
        heroKicker: "Hồ sơ pháp lý",
        highlights: [
          "Xác nhận tình trạng hoạt động của chi nhánh theo thông tin công bố nội bộ.",
          "Nêu rõ địa chỉ khai thác, đại diện phụ trách và phạm vi dịch vụ.",
          "Là đầu mối để phụ huynh, học viên và đối tác đối chiếu thông tin pháp lý cơ bản.",
        ],
        detailBlocks: [
          {
            heading: "Phạm vi công bố",
            body:
              "Tài liệu này được đăng tải nhằm hỗ trợ việc tra cứu minh bạch về chi nhánh vận hành, phù hợp với nhóm nội dung pháp lý công khai của ERG.",
          },
          {
            heading: "Thông tin vận hành",
            body:
              "Bao gồm tên chi nhánh, mã tham chiếu nội bộ, ngày hiệu lực, địa điểm triển khai và bộ phận chịu trách nhiệm cập nhật.",
          },
          {
            heading: "Nguyên tắc cập nhật",
            body:
              "Mỗi khi có thay đổi giấy tờ đăng ký, đại diện phụ trách hoặc phạm vi hoạt động, bản công khai sẽ được rà soát và phát hành lại.",
          },
        ],
        cover: {
          eyebrow: "HỒ SƠ PHÁP LÝ",
          issuedBy: "EDURISE GLOBAL",
          title: "CHỨNG NHẬN HOẠT ĐỘNG CHI NHÁNH",
          subtitle: "Bản công khai phục vụ đối chiếu thông tin pháp lý và năng lực vận hành",
          footer: "Ban hành nội bộ để công khai trên cổng thông tin ERG",
        },
        thumbnailUrl: "https://media.erg.edu.vn/disclosure/phap-ly-thumb.jpg",
        schoolYear: "2025 - 2026",
      },
    ],
  },
  {
    slug: "hoc-phi",
    label: "Học Phí",
    description:
      "Công khai khung học phí, nguyên tắc thu phí, lịch thu và chính sách hỗ trợ học viên theo từng giai đoạn triển khai.",
    accent: "from-sky-100 via-white to-cyan-50",
    documents: [
      {
        sectionSlug: "hoc-phi",
        slug: "hoc-phi",
        title: "Thông báo học phí",
        menuLabel: "Học Phí",
        shortDescription:
          "Công bố khung học phí và chính sách thanh toán áp dụng cho các chương trình đào tạo của ERG.",
        description:
          "Nội dung tổng hợp giúp phụ huynh và học viên theo dõi mức học phí, chu kỳ thanh toán, chính sách ưu đãi và hỗ trợ tài chính hiện hành.",
        publishedAt: "2026-02-03",
        effectiveDate: "2026-02-10",
        referenceCode: "ERG/TC-HP/2026",
        issuingAuthority: "Phòng Tài chính - Vận hành",
        reviewCycle: "Theo kỳ tuyển sinh hoặc khi có điều chỉnh biểu phí",
        accessScope: "Công khai cho phụ huynh, học viên và đối tác tuyển sinh",
        heroKicker: "Tài chính công khai",
        highlights: [
          "Thể hiện khung học phí theo nhóm chương trình và thời lượng đào tạo.",
          "Công khai tiến độ thu, mốc thanh toán và các điều kiện bảo lưu.",
          "Giúp phụ huynh nắm rõ các ưu đãi, học bổng và chính sách hỗ trợ theo đợt tuyển sinh.",
        ],
        detailBlocks: [
          {
            heading: "Khung chi phí",
            body:
              "Biểu công khai phản ánh học phí chuẩn, phụ phí học liệu nếu có và lưu ý áp dụng cho từng nhóm lớp hoặc chương trình.",
          },
          {
            heading: "Tiến độ thanh toán",
            body:
              "Nêu rõ các mốc đóng phí, quy định xác nhận chỗ học và cách xử lý khi học viên cần điều chỉnh lịch nộp.",
          },
          {
            heading: "Chính sách hỗ trợ",
            body:
              "Bao gồm nội dung về học bổng, ưu đãi theo nhóm đăng ký, chuyển lớp và điều kiện hoàn/khấu trừ trong phạm vi quy định.",
          },
        ],
        cover: {
          eyebrow: "THÔNG BÁO TÀI CHÍNH",
          issuedBy: "EDURISE GLOBAL",
          title: "CÔNG KHAI HỌC PHÍ",
          subtitle: "Khung học phí, tiến độ thanh toán và chính sách hỗ trợ học viên",
          footer: "Áp dụng theo từng kỳ tuyển sinh và kế hoạch đào tạo",
        },
        thumbnailUrl: "https://media.erg.edu.vn/disclosure/hoc-phi-thumb.jpg",
        schoolYear: "2025 - 2026",
      },
    ],
  },
  {
    slug: "kiem-dinh-chat-luong",
    label: "Kiểm định chất lượng",
    description:
      "Công khai các tiêu chí đảm bảo chất lượng, quy trình tự đánh giá và ghi nhận cải tiến liên tục trong hoạt động đào tạo.",
    accent: "from-indigo-100 via-white to-blue-50",
    documents: [
      {
        sectionSlug: "kiem-dinh-chat-luong",
        slug: "kiem-dinh-chat-luong",
        title: "Báo cáo kiểm định chất lượng",
        menuLabel: "Kiểm định chất lượng",
        shortDescription:
          "Báo cáo tóm tắt hệ thống bảo đảm chất lượng và các trục đánh giá nội bộ đang áp dụng tại ERG.",
        description:
          "Tài liệu cho thấy cách ERG theo dõi chất lượng chương trình, giảng viên, học liệu và trải nghiệm học viên trên toàn bộ chu kỳ đào tạo.",
        publishedAt: "2026-02-20",
        effectiveDate: "2026-02-20",
        referenceCode: "ERG-QA-2026",
        issuingAuthority: "Hội đồng Đảm bảo chất lượng đào tạo",
        reviewCycle: "Định kỳ hàng năm và sau mỗi đợt tổng kết học kỳ",
        accessScope: "Công khai với phụ huynh, học viên và đối tác chuyên môn",
        heroKicker: "Đảm bảo chất lượng",
        highlights: [
          "Mô tả khung tiêu chí đánh giá chương trình, lớp học và trải nghiệm người học.",
          "Phản ánh kết quả rà soát nội bộ và kế hoạch cải tiến sau từng chu kỳ đánh giá.",
          "Tạo nền tảng minh bạch cho việc theo dõi chất lượng đào tạo trên website chính thức.",
        ],
        detailBlocks: [
          {
            heading: "Tiêu chí đánh giá",
            body:
              "Tập trung vào chuẩn đầu ra, chất lượng giảng dạy, mức độ cập nhật học liệu và năng lực hỗ trợ học viên trong quá trình học.",
          },
          {
            heading: "Bằng chứng cải tiến",
            body:
              "Tài liệu nêu các hạng mục đã được nâng cấp hoặc hiệu chỉnh sau quá trình phản hồi từ học viên, phụ huynh và đội ngũ chuyên môn.",
          },
          {
            heading: "Chu kỳ kiểm định",
            body:
              "Mỗi chu kỳ đánh giá bao gồm tự rà soát, tổng hợp dữ liệu vận hành và đối chiếu với tiêu chí chất lượng đã công bố.",
          },
        ],
        cover: {
          eyebrow: "BÁO CÁO CHẤT LƯỢNG",
          issuedBy: "EDURISE GLOBAL",
          title: "KIỂM ĐỊNH CHẤT LƯỢNG ĐÀO TẠO",
          subtitle: "Khung đánh giá nội bộ và bằng chứng cải tiến hoạt động học tập",
          footer: "Cập nhật theo chu kỳ đảm bảo chất lượng thường niên",
        },
        thumbnailUrl: "https://media.erg.edu.vn/disclosure/kiem-dinh-thumb.jpg",
        schoolYear: "2025 - 2026",
      },
    ],
  },
  {
    slug: "ke-hoach-giang-day",
    label: "Kế hoạch giảng dạy",
    description:
      "Công khai định hướng tổ chức lớp học, lịch phân bổ học phần và các mốc triển khai chính cho từng chu kỳ đào tạo.",
    accent: "from-emerald-100 via-white to-teal-50",
    documents: [
      {
        sectionSlug: "ke-hoach-giang-day",
        slug: "ke-hoach-giang-day",
        title: "Kế hoạch giảng dạy",
        menuLabel: "Kế hoạch giảng dạy",
        shortDescription:
          "Khung công khai về lộ trình triển khai học phần, mốc kiểm tra và phương thức tổ chức đào tạo trong năm.",
        description:
          "Nội dung giúp phụ huynh và học viên nhìn rõ các giai đoạn triển khai chương trình, mốc đánh giá và hình thức học tập dự kiến.",
        publishedAt: "2026-03-01",
        effectiveDate: "2026-03-04",
        referenceCode: "ERG-KHGD-2026",
        issuingAuthority: "Khối Chuyên môn và Phát triển chương trình",
        reviewCycle: "Theo năm học hoặc đợt điều chỉnh kế hoạch đào tạo",
        accessScope: "Công khai cho học viên, phụ huynh và đội ngũ điều phối học thuật",
        heroKicker: "Điều phối học thuật",
        highlights: [
          "Công bố cấu trúc học phần, mốc đánh giá và nhịp độ triển khai chương trình.",
          "Giúp phụ huynh theo dõi tiến độ học tập và chuẩn bị cho các đợt kiểm tra hoặc dự án.",
          "Làm rõ phương thức học, lịch học dự kiến và nguyên tắc cập nhật khi điều phối lớp thay đổi.",
        ],
        detailBlocks: [
          {
            heading: "Cấu trúc năm học",
            body:
              "Kế hoạch chia theo giai đoạn khởi động, tăng cường kỹ năng, đánh giá định kỳ và tổng kết năng lực vào cuối chu kỳ đào tạo.",
          },
          {
            heading: "Mốc đánh giá",
            body:
              "Bao gồm kiểm tra giữa kỳ, dự án thực hành, bài đánh giá cuối chặng và mốc phản hồi chất lượng để điều chỉnh lớp học.",
          },
          {
            heading: "Tổ chức triển khai",
            body:
              "Tài liệu cũng chỉ ra cách điều phối giữa lớp trực tiếp, trực tuyến hoặc blended learning trong trường hợp cần tối ưu lịch học.",
          },
        ],
        cover: {
          eyebrow: "KẾ HOẠCH HỌC THUẬT",
          issuedBy: "EDURISE GLOBAL",
          title: "KẾ HOẠCH GIẢNG DẠY",
          subtitle: "Lộ trình triển khai chương trình, mốc kiểm tra và điều phối lớp học",
          footer: "Phát hành để công khai tiến độ đào tạo trên hệ thống ERG",
        },
        thumbnailUrl: "https://media.erg.edu.vn/disclosure/ke-hoach-thumb.jpg",
        schoolYear: "2025 - 2026",
      },
    ],
  },
];

export const PUBLIC_DISCLOSURE_SECTIONS = disclosureSections;

export function getDisclosureSection(sectionSlug: string) {
  return disclosureSections.find((section) => section.slug === sectionSlug);
}

export function getDisclosureDocument(sectionSlug: string, documentSlug?: string) {
  const section = getDisclosureSection(sectionSlug);
  if (!section) {
    return null;
  }

  const normalizedSlug = documentSlug || sectionSlug;
  return section.documents.find((document) => document.slug === normalizedSlug) || null;
}

export function getAllDisclosureDocuments() {
  return disclosureSections.flatMap((section) => section.documents);
}
