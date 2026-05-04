export type TrainingField = {
    id: number;
    slug: string;
    title: string;
    description: string;
    group: string;
    badge: string;
    image: string;
    imageAlt: string;
    link: string;
    intro: string;
    highlights: string[];
    outcomes: string[];
    audience: string[];
    curriculum: string[];
    assessment: string;
};

export const TRAINING_CONTACT_URL = "https://zalo.me/0766144888";

const detailPath = (slug: string) => `/linh-vuc-dao-tao/${slug}`;

const TRAINING_BASE_KEYWORDS = [
    "ERG",
    "Edurise Global",
    "trung tâm tin học ERG",
    "đào tạo CNTT",
    "chứng chỉ tin học",
    "lập trình cho học sinh",
    "khóa học công nghệ",
];

export const TRAINING_FIELDS: TrainingField[] = [
    {
        id: 1,
        slug: "ic3-gs6",
        title: "IC3 GS6",
        group: "Chứng chỉ & kỹ năng cơ bản",
        badge: "Global Standard 6",
        description: "Chuẩn năng lực số quốc tế giúp học viên sử dụng máy tính, Internet và các công cụ công nghệ một cách tự tin, an toàn.",
        image: "/util/ic3.jpg",
        imageAlt: "Chứng chỉ IC3 GS6",
        link: detailPath("ic3-gs6"),
        intro: "IC3 GS6 (Global Standard Six) là tiêu chuẩn toàn cầu về năng lực sử dụng các công cụ công nghệ, thiết bị kỹ thuật số và Internet. Chương trình giúp người học hình thành nền tảng số bền vững, được công nhận bởi các tổ chức uy tín trên thế giới.",
        highlights: [
            "Bám sát chuẩn Global Digital Literacy Standard.",
            "Trang bị kỹ năng máy tính, Internet, an toàn số và công cụ làm việc hiện đại.",
            "Phù hợp cho học sinh, sinh viên và người đi làm cần chuẩn hóa năng lực số."
        ],
        outcomes: [
            "Sử dụng máy tính và Internet an toàn, hiệu quả.",
            "Hiểu nền tảng phần cứng, phần mềm, dữ liệu và môi trường trực tuyến.",
            "Sẵn sàng tham gia kỳ thi chứng chỉ IC3 GS6 quốc tế."
        ],
        audience: [
            "Học sinh THCS, THPT cần nền tảng tin học chuẩn quốc tế.",
            "Sinh viên cần chứng chỉ năng lực số cho học tập và hồ sơ nghề nghiệp.",
            "Người đi làm muốn chuẩn hóa kỹ năng công nghệ căn bản."
        ],
        curriculum: [
            "Máy tính căn bản và hệ điều hành.",
            "Ứng dụng chính trong học tập, làm việc và giao tiếp số.",
            "Cuộc sống trực tuyến, an toàn thông tin và công dân số."
        ],
        assessment: "ERG tổ chức học theo lộ trình thực hành, kiểm tra năng lực định kỳ và tư vấn thời điểm thi chứng chỉ phù hợp."
    },
    {
        id: 2,
        slug: "mos",
        title: "MOS",
        group: "Chứng chỉ & kỹ năng cơ bản",
        badge: "Microsoft Office Specialist",
        description: "Chứng chỉ Tin học Văn phòng Quốc tế do Microsoft chứng nhận, giúp học viên thành thạo Word, Excel, PowerPoint trong học tập và công việc.",
        image: "/util/mos.jpg",
        imageAlt: "Chứng chỉ Microsoft Office Specialist",
        link: detailPath("mos"),
        intro: "MOS (Microsoft Office Specialist) là chứng chỉ Tin học Văn phòng Quốc tế, đánh giá năng lực sử dụng bộ công cụ Microsoft Office. Chứng chỉ này ngày càng phổ biến vì hỗ trợ trực tiếp cho học tập, tốt nghiệp, tuyển dụng và hiệu suất công việc.",
        highlights: [
            "Chuẩn kỹ năng văn phòng quốc tế trên Word, Excel và PowerPoint.",
            "Bài học đi thẳng vào thao tác thực tế, hạn chế lý thuyết rời rạc.",
            "Phù hợp với nhu cầu ra trường, đi làm và nâng cao năng suất cá nhân."
        ],
        outcomes: [
            "Soạn thảo tài liệu chuyên nghiệp bằng Word.",
            "Xử lý bảng tính, hàm, biểu đồ và dữ liệu bằng Excel.",
            "Thiết kế bài trình chiếu rõ ràng, thuyết phục bằng PowerPoint."
        ],
        audience: [
            "Học sinh, sinh viên cần chứng chỉ tin học văn phòng.",
            "Nhân viên văn phòng muốn tăng tốc xử lý công việc.",
            "Ứng viên cần lợi thế trong hồ sơ tuyển dụng."
        ],
        curriculum: [
            "Word: định dạng tài liệu, bảng, tham chiếu và xuất bản.",
            "Excel: công thức, hàm, biểu đồ, lọc và phân tích dữ liệu.",
            "PowerPoint: bố cục slide, hình ảnh, biểu đồ và trình chiếu."
        ],
        assessment: "Học viên được luyện theo ngân hàng bài tập thao tác, thi thử và nhận phản hồi chi tiết trước khi thi chứng chỉ."
    },
    {
        id: 3,
        slug: "tin-hoc-co-ban-nang-cao",
        title: "Tin học cơ bản & nâng cao",
        group: "Chứng chỉ & kỹ năng cơ bản",
        badge: "Chuẩn kỹ năng CNTT Việt Nam",
        description: "Chương trình theo chuẩn kỹ năng sử dụng công nghệ thông tin tại Việt Nam, gồm nền tảng cơ bản và các mô-đun nâng cao.",
        image: "/util/cnttnc.jpg",
        imageAlt: "Chứng chỉ ứng dụng công nghệ thông tin cơ bản và nâng cao",
        link: detailPath("tin-hoc-co-ban-nang-cao"),
        intro: "Tin học cơ bản và nâng cao được xây dựng theo chuẩn kỹ năng sử dụng công nghệ thông tin tại Việt Nam. Chương trình giúp học viên hoàn thiện năng lực sử dụng máy tính, phần mềm văn phòng và các mô-đun CNTT cần thiết cho học tập, công việc và thi tuyển.",
        highlights: [
            "Bám sát chuẩn kỹ năng CNTT theo quy định tại Việt Nam.",
            "Kết hợp kỹ năng nền tảng và các mô-đun nâng cao theo nhu cầu.",
            "Học theo tình huống thực tế, dễ áp dụng vào văn phòng và học tập."
        ],
        outcomes: [
            "Nắm chắc thao tác máy tính, hệ điều hành và Internet.",
            "Sử dụng hiệu quả Word, Excel, PowerPoint và công cụ văn phòng.",
            "Có năng lực tiếp cận các mô-đun nâng cao như dữ liệu, trình chiếu, đồ họa và bảo mật."
        ],
        audience: [
            "Học viên cần chứng chỉ CNTT phục vụ hồ sơ học tập hoặc thi tuyển.",
            "Người đi làm cần củng cố kỹ năng tin học văn phòng.",
            "Cán bộ, nhân viên cần chuẩn hóa năng lực sử dụng CNTT."
        ],
        curriculum: [
            "CNTT cơ bản: máy tính, hệ điều hành, Internet và văn phòng.",
            "CNTT nâng cao: xử lý văn bản, bảng tính, trình chiếu chuyên sâu.",
            "Các chuyên đề theo nhu cầu: cơ sở dữ liệu, thiết kế đồ họa, biên tập ảnh, an toàn thông tin."
        ],
        assessment: "Lộ trình được cá nhân hóa theo mục tiêu chứng chỉ, có bài kiểm tra đầu vào và bài đánh giá cuối khóa."
    },
    {
        id: 4,
        slug: "chuong-trinh-lien-ket-dao-tao",
        title: "Chương trình liên kết đào tạo",
        group: "Chứng chỉ & kỹ năng cơ bản",
        badge: "Joint Training Programs",
        description: "Các chương trình liên kết đào tạo tin học ngắn hạn, trung hạn và dài hạn, linh hoạt theo nhu cầu trường học, doanh nghiệp và tổ chức.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Liên kết đào tạo tin học với trường học và doanh nghiệp",
        link: detailPath("chuong-trinh-lien-ket-dao-tao"),
        intro: "Chương trình liên kết đào tạo do ERG thiết kế cho trường học, doanh nghiệp và tổ chức có nhu cầu triển khai các lớp tin học theo chuẩn quốc tế hoặc quốc gia. Nội dung có thể tổ chức ngắn hạn, trung hạn hoặc dài hạn với hình thức trực tiếp, trực tuyến hoặc kết hợp.",
        highlights: [
            "Thiết kế riêng theo mục tiêu đào tạo và năng lực đầu vào.",
            "Có thể triển khai MOS, IC3, chuyên đề đồ họa, lập trình và kỹ năng số.",
            "Linh hoạt địa điểm, thời lượng, lịch học và phương thức đánh giá."
        ],
        outcomes: [
            "Xây dựng lộ trình đào tạo thống nhất cho từng nhóm học viên.",
            "Chuẩn hóa đầu ra bằng bài kiểm tra, dự án hoặc chứng chỉ.",
            "Tạo báo cáo tiến độ rõ ràng cho nhà trường, doanh nghiệp hoặc đơn vị phối hợp."
        ],
        audience: [
            "Trường học muốn bổ sung chương trình tin học chuẩn hóa.",
            "Doanh nghiệp cần đào tạo kỹ năng số cho nhân sự.",
            "Tổ chức cần triển khai lớp ngắn hạn, chuyên đề hoặc bồi dưỡng năng lực."
        ],
        curriculum: [
            "Khảo sát nhu cầu và đánh giá đầu vào.",
            "Thiết kế giáo trình, lịch học và tiêu chí đầu ra.",
            "Đào tạo, kiểm tra tiến độ, tổng kết và cấp chứng nhận phù hợp."
        ],
        assessment: "ERG cung cấp báo cáo học tập định kỳ, bài kiểm tra sau từng giai đoạn và khuyến nghị cải tiến chương trình."
    },
    {
        id: 5,
        slug: "lap-trinh-thieu-nhi",
        title: "Lập trình thiếu nhi",
        group: "Lập trình & phát triển năng lực",
        badge: "Kids Programming",
        description: "Chương trình lập trình cho trẻ 5-15 tuổi, giúp phát triển tư duy logic, giải quyết vấn đề và sáng tạo công nghệ qua Scratch, Python.",
        image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Học sinh học lập trình thiếu nhi",
        link: detailPath("lap-trinh-thieu-nhi"),
        intro: "Lập trình thiếu nhi là chương trình giúp trẻ từ 5-15 tuổi tiếp cận tư duy logic, thuật toán và sáng tạo công nghệ thông qua các bài học trực quan. Trẻ bắt đầu với Scratch để hiểu cách tạo sản phẩm số, sau đó có thể nâng cấp lên Python khi đã sẵn sàng.",
        highlights: [
            "Học qua trò chơi, câu chuyện, dự án và sản phẩm trực quan.",
            "Phát triển tư duy logic, kiên trì và kỹ năng giải quyết vấn đề.",
            "Lộ trình chuyển tiếp từ Scratch đến Python rõ ràng."
        ],
        outcomes: [
            "Tự tạo trò chơi, hoạt hình hoặc sản phẩm tương tác đơn giản.",
            "Hiểu khái niệm biến, vòng lặp, điều kiện và sự kiện.",
            "Tự tin trình bày ý tưởng và cải tiến sản phẩm công nghệ."
        ],
        audience: [
            "Trẻ từ 5-15 tuổi mới bắt đầu tiếp cận công nghệ.",
            "Học sinh yêu thích trò chơi, robot, tư duy logic và sáng tạo.",
            "Phụ huynh muốn con học công nghệ đúng cách, không chỉ sử dụng thiết bị thụ động."
        ],
        curriculum: [
            "Scratch nền tảng: nhân vật, sự kiện, chuyển động và trò chơi.",
            "Scratch nâng cao: biến, điều kiện, vòng lặp và dự án cá nhân.",
            "Python nhập môn: cú pháp cơ bản, bài toán nhỏ và tư duy thuật toán."
        ],
        assessment: "Mỗi giai đoạn có sản phẩm cuối khóa để phụ huynh nhìn thấy rõ tiến bộ và năng lực thực hành của học sinh."
    },
    {
        id: 6,
        slug: "stem-robotics",
        title: "STEM Robotics",
        group: "Lập trình & phát triển năng lực",
        badge: "STEM-integrated Robotics",
        description: "Giáo dục tích hợp khoa học, công nghệ, kỹ thuật và toán học thông qua thiết kế, lắp ráp và lập trình robot.",
        image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Học sinh học STEM Robotics",
        link: detailPath("stem-robotics"),
        intro: "STEM Robotics là phương pháp giáo dục tích hợp khoa học, công nghệ, kỹ thuật và toán học qua việc thiết kế, lắp ráp và lập trình robot. Học viên không chỉ học kiến thức công nghệ mà còn rèn tư duy hệ thống, thử nghiệm và tối ưu giải pháp.",
        highlights: [
            "Học bằng mô hình robot thực tế và nhiệm vụ thử thách.",
            "Kết hợp tư duy kỹ thuật, lập trình, toán học và làm việc nhóm.",
            "Khuyến khích học sinh đặt giả thuyết, thử nghiệm và cải tiến."
        ],
        outcomes: [
            "Hiểu nguyên lý cảm biến, động cơ và điều khiển robot.",
            "Biết lập trình robot thực hiện nhiệm vụ cụ thể.",
            "Rèn kỹ năng phân tích, hợp tác và giải quyết vấn đề mở."
        ],
        audience: [
            "Học sinh yêu thích robot, lắp ráp và công nghệ.",
            "Trường học muốn triển khai hoạt động STEM thực hành.",
            "Câu lạc bộ cần chương trình robotics có lộ trình rõ ràng."
        ],
        curriculum: [
            "Nhập môn STEM và cấu trúc robot.",
            "Lập trình điều khiển, cảm biến, chuyển động và phản hồi.",
            "Dự án robot theo chủ đề và thử thách nhóm."
        ],
        assessment: "Học viên được đánh giá qua sản phẩm robot, khả năng giải thích giải pháp và quá trình cải tiến qua từng thử thách."
    },
    {
        id: 7,
        slug: "tri-tue-nhan-tao-ai",
        title: "Trí tuệ nhân tạo (AI)",
        group: "Lập trình & phát triển năng lực",
        badge: "Artificial Intelligence",
        description: "Chương trình giúp học viên hiểu AI, học máy và cách ứng dụng trí tuệ nhân tạo vào học tập, công việc và sáng tạo sản phẩm.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Chương trình trí tuệ nhân tạo AI",
        link: detailPath("tri-tue-nhan-tao-ai"),
        intro: "Trí tuệ nhân tạo (AI) là công nghệ mô phỏng quá trình tư duy, học tập và ra quyết định của con người bằng máy móc. Chương trình tại ERG giúp học viên hiểu AI một cách dễ tiếp cận, gồm thu thập dữ liệu, lập luận, học máy và tự cải thiện kết quả.",
        highlights: [
            "Giải thích AI bằng ví dụ gần gũi, không nặng thuật ngữ.",
            "Kết hợp tư duy dữ liệu, mô hình học máy và ứng dụng thực tế.",
            "Hướng dẫn sử dụng AI có trách nhiệm trong học tập và công việc."
        ],
        outcomes: [
            "Hiểu AI, machine learning, dữ liệu và mô hình dự đoán ở mức nền tảng.",
            "Biết ứng dụng AI để học tập, phân tích, sáng tạo nội dung và tự động hóa đơn giản.",
            "Nhận diện rủi ro về dữ liệu, đạo đức và độ tin cậy của kết quả AI."
        ],
        audience: [
            "Học sinh muốn tiếp cận AI sớm và đúng nền tảng.",
            "Sinh viên, người đi làm muốn ứng dụng AI vào học tập và công việc.",
            "Giáo viên, phụ huynh cần hiểu cách đồng hành cùng học sinh trong thời đại AI."
        ],
        curriculum: [
            "Tổng quan AI, dữ liệu, học máy và mô hình.",
            "Ứng dụng AI trong học tập, văn phòng và sáng tạo.",
            "Thực hành xây dựng ý tưởng, thử nghiệm công cụ AI và đánh giá kết quả."
        ],
        assessment: "Học viên thực hiện bài tập ứng dụng theo tình huống thực tế và trình bày cách dùng AI an toàn, hiệu quả."
    },
    {
        id: 8,
        slug: "luyen-thi-hoc-sinh-gioi-tin-hoc",
        title: "Luyện thi học sinh giỏi Tin học",
        group: "Lập trình & phát triển năng lực",
        badge: "Competitive Student Programming",
        description: "Lộ trình bồi dưỡng học sinh có năng lực tốt, tập trung thuật toán, cấu trúc dữ liệu và kỹ năng lập trình thi học sinh giỏi.",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Luyện thi học sinh giỏi Tin học",
        link: detailPath("luyen-thi-hoc-sinh-gioi-tin-hoc"),
        intro: "Luyện thi học sinh giỏi Tin học dành cho học sinh có nền tảng tốt và mong muốn phát triển năng lực lập trình ở mức cao hơn. Chương trình tập trung vào tư duy thuật toán, cấu trúc dữ liệu, kỹ năng đọc đề và tối ưu lời giải.",
        highlights: [
            "Rèn tư duy giải bài theo từng nhóm thuật toán.",
            "Kết hợp luyện đề, phân tích lỗi và tối ưu code.",
            "Điều chỉnh ngôn ngữ theo cấp học: Scratch, Python, C++ hoặc ngôn ngữ phù hợp."
        ],
        outcomes: [
            "Nắm vững tư duy thuật toán nền tảng và nâng cao.",
            "Biết phân tích đề, chọn cấu trúc dữ liệu và đánh giá độ phức tạp.",
            "Tăng sự tự tin khi tham gia kỳ thi học sinh giỏi hoặc sân chơi lập trình."
        ],
        audience: [
            "Học sinh có định hướng thi học sinh giỏi Tin học.",
            "Học sinh đã có nền tảng Scratch, Python hoặc C++.",
            "Nhóm học sinh cần lộ trình bồi dưỡng chuyên sâu theo năng lực."
        ],
        curriculum: [
            "Tư duy thuật toán: tìm kiếm, sắp xếp, đệ quy và quy hoạch động nhập môn.",
            "Cấu trúc dữ liệu: mảng, chuỗi, stack, queue, map và graph cơ bản.",
            "Luyện đề theo chuyên đề, chữa bài và tối ưu giải pháp."
        ],
        assessment: "ERG đánh giá bằng bài kiểm tra chuyên đề, bảng theo dõi tiến bộ và đề mô phỏng theo cấp độ thi."
    },
    {
        id: 9,
        slug: "tin-hoc-tre",
        title: "Tin học trẻ",
        group: "Lập trình & phát triển năng lực",
        badge: "Youth Computer Science",
        description: "Chương trình Tin học trẻ giúp học sinh xây dựng sản phẩm số, rèn tư duy thuật toán, trình bày ý tưởng và chuẩn bị cho các sân chơi công nghệ.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Học sinh tham gia chương trình Tin học trẻ",
        link: detailPath("tin-hoc-tre"),
        intro: "Tin học trẻ là chương trình giúp học sinh phát triển tư duy công nghệ qua các sản phẩm số gần gũi như bài trình chiếu tương tác, trò chơi, mô phỏng, website nhỏ hoặc ứng dụng đơn giản. ERG tập trung vào khả năng hiểu đề, triển khai ý tưởng, trình bày sản phẩm và tự tin tham gia các sân chơi Tin học trẻ.",
        highlights: [
            "Kết hợp tư duy thuật toán với sản phẩm sáng tạo có thể trình bày.",
            "Rèn kỹ năng đọc yêu cầu, chia nhỏ vấn đề và hoàn thiện bài làm.",
            "Phù hợp với học sinh muốn tham gia Tin học trẻ, câu lạc bộ hoặc dự án công nghệ."
        ],
        outcomes: [
            "Tự xây dựng sản phẩm số theo chủ đề học tập hoặc cuộc thi.",
            "Biết trình bày ý tưởng, quy trình thực hiện và kết quả sản phẩm.",
            "Có nền tảng tốt để chuyển tiếp sang Python, C++ hoặc lập trình thi đấu."
        ],
        audience: [
            "Học sinh tiểu học, THCS, THPT yêu thích công nghệ và sáng tạo.",
            "Học sinh muốn chuẩn bị cho các cuộc thi Tin học trẻ.",
            "Nhóm học sinh cần lộ trình vừa học lập trình vừa làm sản phẩm thực tế."
        ],
        curriculum: [
            "Tư duy sản phẩm: ý tưởng, bố cục, luồng thao tác và tiêu chí chấm.",
            "Scratch/Python hoặc công cụ phù hợp theo độ tuổi và nền tảng.",
            "Hoàn thiện sản phẩm, kiểm thử, thuyết trình và cải tiến theo góp ý."
        ],
        assessment: "ERG đánh giá theo cả quá trình và sản phẩm cuối khóa: ý tưởng, tính hoàn thiện, khả năng trình bày và mức độ vận dụng kiến thức."
    },
    {
        id: 10,
        slug: "lap-trinh-thi-dau-cp",
        title: "Lập trình thi đấu (CP)",
        group: "Lập trình & phát triển năng lực",
        badge: "Competitive Programming",
        description: "Lộ trình lập trình thi đấu giúp học viên rèn tốc độ giải bài, thuật toán, cấu trúc dữ liệu và tư duy tối ưu bằng Python, C++ hoặc Java.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Lập trình thi đấu và giải thuật",
        link: detailPath("lap-trinh-thi-dau-cp"),
        intro: "Lập trình thi đấu (Competitive Programming) dành cho học viên muốn giải bài toán thuật toán trong thời gian giới hạn. Chương trình tập trung vào cách đọc đề, chọn hướng giải, tối ưu độ phức tạp và rèn luyện qua hệ thống bài tập phân tầng.",
        highlights: [
            "Luyện thuật toán theo chuyên đề, từ nền tảng đến nâng cao.",
            "Tập trung tốc độ, độ chính xác và khả năng kiểm thử lời giải.",
            "Phù hợp với mục tiêu thi học sinh giỏi, Olympic, câu lạc bộ hoặc sân chơi online."
        ],
        outcomes: [
            "Viết lời giải đúng, rõ ràng và tối ưu hơn qua từng vòng luyện tập.",
            "Nắm được các kỹ thuật quan trọng như brute force, greedy, dynamic programming và graph.",
            "Tự tin tham gia các kỳ thi lập trình theo cấp độ phù hợp."
        ],
        audience: [
            "Học sinh đã có nền tảng lập trình cơ bản và muốn học sâu thuật toán.",
            "Học sinh chuẩn bị thi học sinh giỏi Tin học hoặc Olympic.",
            "Người học muốn rèn tư duy giải bài và kỹ năng lập trình cạnh tranh."
        ],
        curriculum: [
            "Kỹ thuật đọc đề, chia bài toán, kiểm thử và phân tích độ phức tạp.",
            "Cấu trúc dữ liệu: mảng, chuỗi, stack, queue, map, set và graph.",
            "Chuyên đề thuật toán: tìm kiếm, sắp xếp, greedy, dynamic programming và xử lý chuỗi."
        ],
        assessment: "Học viên được luyện theo bộ đề phân tầng, theo dõi thời gian giải, số test đúng và nhận phản hồi chi tiết sau mỗi vòng luyện tập."
    }
];

export const TRAINING_FIELD_SLUGS = TRAINING_FIELDS.map((field) => field.slug);

export function getTrainingFieldBySlug(slug: string) {
    return TRAINING_FIELDS.find((field) => field.slug === slug);
}

export function getTrainingFieldSeo(field: TrainingField) {
    const keywords = Array.from(new Set([
        field.title,
        field.badge,
        field.group,
        `${field.title} ERG`,
        `khóa học ${field.title}`,
        `đào tạo ${field.title}`,
        `chương trình ${field.title}`,
        ...TRAINING_BASE_KEYWORDS,
    ]));

    return {
        title: `${field.title} | Chương trình đào tạo CNTT ERG`,
        description: field.description,
        keywords,
    };
}
