import type { PostDetailResponse } from '@/services/posts.api';
import { buildSeoKeywords } from '@/utils/seo/keywords';

export interface ErgNewsMockItem {
    id: number;
    title: string;
    date: string;
    displayDate: string;
    summary: string;
    image: string;
    slug: string;
}

type MockPostDetail = PostDetailResponse['data'];

const ERG_NEWS_CATEGORY = {
    id: 'mock-category-erg-news',
    name: 'Tin tức ERG',
    slug: '',
};

const ERG_NEWS_AUTHOR = {
    fullName: 'Ban truyền thông ERG',
};

function buildSummerProgramContent() {
    return `
        <section>
            <p><strong>Khóa bán trú hè 2026</strong> là chương trình trọng điểm của ERG dành cho học sinh chuẩn bị vào lớp 1, học sinh Tiểu học và THCS với định hướng phát triển đồng thời 5 năng lực cốt lõi: <strong>Toán tư duy, Tiếng Việt, Tiếng Anh giao tiếp, Tin học ứng dụng và STEM Lập trình</strong>.</p>
            <p>Lộ trình được thiết kế theo từng độ tuổi để học sinh vừa bứt phá trong hè, vừa tạo nền tảng học tập vững vàng cho năm học mới. Tinh thần xuyên suốt của chương trình là: <strong>“Hè bứt phá - Kiến tạo tương lai”</strong>.</p>
        </section>

        <section>
            <h2 id="tong-quan">Tổng quan chương trình</h2>
            <ul>
                <li><strong>Đối tượng:</strong> Tiền Tiểu học (chuẩn bị vào lớp 1), học sinh Cấp 1 và Cấp 2.</li>
                <li><strong>Thời gian:</strong> 01/06/2026 - 28/08/2026.</li>
                <li><strong>Hình thức:</strong> Bán trú từ thứ 2 đến thứ 6.</li>
                <li><strong>Điểm nhấn:</strong> Kết hợp học thuật, kỹ năng công nghệ, hoạt động dự án và sân khấu hóa cuối khóa.</li>
                <li><strong>Ưu đãi hiện tại:</strong> Giảm ngay 30% học phí cho phụ huynh đăng ký sớm.</li>
            </ul>
        </section>

        <section>
            <h2 id="tien-tieu-hoc">1. Phân khúc Tiền Tiểu Học</h2>
            <p><strong>Slogan:</strong> “Tự tin bước vào Lớp 1 - Không ngỡ ngàng, không áp lực”.</p>
            <ul>
                <li><strong>Toán tư duy:</strong> Làm quen số đếm qua hình khối, trò chơi logic, so sánh lớn - nhỏ, cao - thấp và nhận diện quy luật đơn giản.</li>
                <li><strong>Tiếng Việt - Rèn chữ:</strong> Nhận diện bảng chữ cái, ghép vần cơ bản; uốn nắn tư thế ngồi, cách cầm bút và các nét viết nền tảng.</li>
                <li><strong>Tiếng Anh giao tiếp:</strong> Học qua bài hát, Flashcard và trò chơi tương tác với các chủ đề gần gũi như gia đình, màu sắc, động vật, chào hỏi.</li>
                <li><strong>Tin học:</strong> Nhận biết chuột, bàn phím, màn hình qua trò chơi tương tác vẽ tranh, nối hình và kỹ năng bảo vệ mắt khi dùng máy tính.</li>
                <li><strong>STEM Lập trình:</strong> Tiếp cận tư duy máy tính không dùng màn hình qua mê cung vật lý, lắp ráp LEGO đơn giản theo chủ đề tự nhiên.</li>
            </ul>
        </section>

        <section>
            <h2 id="cap-1">2. Phân khúc Cấp 1 (Lớp 1 - Lớp 5)</h2>
            <p><strong>Slogan:</strong> “Vững kiến thức nền - Bền kỹ năng công nghệ”.</p>
            <ul>
                <li><strong>Toán tư duy:</strong> Phát triển logic bằng sơ đồ tư duy toán học, toán đố thực tế và hình học trực quan để học sinh không sợ toán.</li>
                <li><strong>Tiếng Việt - Rèn chữ:</strong> Luyện viết chữ đẹp, đúng chính tả; nâng cao viết văn sáng tạo như làm thơ, viết thư và tả cảnh.</li>
                <li><strong>Tiếng Anh giao tiếp:</strong> Tăng phản xạ tự nhiên qua Show and Tell, đóng kịch và thảo luận nhóm hằng tuần.</li>
                <li><strong>Tin học:</strong> Sử dụng máy tính an toàn, thao tác Windows, gõ 10 ngón và làm quen kỹ năng số cơ bản theo chuẩn IC3 Spark.</li>
                <li><strong>STEM Lập trình:</strong> Lớp 1-3 học Scratch Jr / Scratch để làm phim hoạt hình, thiệp điện tử; lớp 4-5 phát triển trò chơi sáng tạo, robot mini và mạch điện giấy thông minh.</li>
            </ul>
        </section>

        <section>
            <h2 id="cap-2">3. Phân khúc Cấp 2 (Lớp 6 - Lớp 9)</h2>
            <p><strong>Slogan:</strong> “Tư duy thủ lĩnh - Sẵn sàng hội nhập”.</p>
            <ul>
                <li><strong>Toán tư duy:</strong> Ứng dụng toán vào đời sống với toán tài chính cá nhân, thống kê, xác suất qua trò chơi và tăng tư duy phản biện.</li>
                <li><strong>Tiếng Việt - Kỹ năng lập luận:</strong> Tập trung viết báo cáo khoa học, cảm thụ văn học chuyên sâu và tranh biện để bảo vệ quan điểm.</li>
                <li><strong>Tiếng Anh giao tiếp:</strong> Học tiếng Anh học thuật kết hợp tranh biện, phỏng vấn giả định và thuyết trình dự án.</li>
                <li><strong>Tin học:</strong> Làm chủ Word, Excel, PowerPoint theo định hướng MOS, đồng thời phát triển kỹ năng tìm kiếm thông tin an toàn trên môi trường số.</li>
                <li><strong>STEM Lập trình:</strong> Làm quen Python cơ bản hoặc lập trình phần cứng Robotics/Arduino để giải quyết các bài toán môi trường và đô thị thông minh.</li>
            </ul>
        </section>

        <section>
            <h2 id="dau-ra-du-an">III. Điểm nhấn hoạt động &amp; đầu ra dự án</h2>
            <ol>
                <li><strong>Ngày hội Tin học &amp; STEM (giữa tháng 7):</strong> Học sinh tự tin thuyết trình về sản phẩm Scratch hoặc mô hình robot do chính mình thiết kế.</li>
                <li><strong>Cuốn sách mùa hè của em (cuối tháng 8):</strong> Mỗi học sinh Cấp 1, Cấp 2 có một tập san riêng lưu giữ bài viết chữ đẹp, bài văn sáng tạo hoặc dự án PowerPoint.</li>
                <li><strong>Lễ tổng kết Gala rực rỡ (tuần 13):</strong> Sân khấu hóa các tiết mục kịch tiếng Anh, trao chứng nhận “Chiến binh Hè 2026” và vinh danh các dự án công nghệ xuất sắc.</li>
            </ol>
        </section>

        <section>
            <h2 id="gia-tri-phu-huynh">Giá trị phụ huynh nhận thấy rõ</h2>
            <p>Không chỉ là một khóa học hè, chương trình còn giúp phụ huynh nhìn thấy rõ tiến bộ của con qua từng cột mốc đầu ra, hồ sơ sản phẩm cá nhân và sự tự tin trong giao tiếp, thuyết trình, làm việc nhóm.</p>
            <p>ERG định hướng mỗi học sinh rời khóa hè với một nền tảng kỹ năng thực tế, sự chủ động trong học tập và tinh thần sẵn sàng cho năm học 2026-2027.</p>
        </section>
    `;
}

function buildAcademicEnglishContent() {
    return `
        <section>
            <p><strong>TIN HỌC VĂN PHÒNG – KỸ NĂNG BẮT BUỘC TRONG THỜI ĐẠI SỐ.</strong> Bạn vẫn còn loay hoay với Word? Excel làm mãi vẫn sai công thức? PowerPoint chưa đủ chuyên nghiệp khi thuyết trình? Nếu bạn từng thấy mình mất rất nhiều thời gian cho những thao tác tưởng như cơ bản, thì đây chính là lúc cần nâng cấp kỹ năng một cách bài bản.</p>
            <p>Trung tâm Tin học <strong>ERG - EDURISE GLOBAL</strong> xây dựng khóa học Tin học văn phòng theo hướng dễ hiểu, thực tế và học để dùng được ngay. Mục tiêu không chỉ là biết công cụ, mà là <strong>thành thạo kỹ năng số để học nhanh hơn, làm việc hiệu quả hơn và tự tin hơn trong môi trường học tập - công việc hiện đại</strong>.</p>
        </section>
        <section>
            <h2 id="hoc-duoc-gi">Bạn sẽ học được gì?</h2>
            <ul>
                <li><strong>Word nhanh - đẹp - chuẩn chuyên nghiệp:</strong> Soạn thảo văn bản gọn gàng, đúng bố cục, biết căn lề, định dạng, trình bày báo cáo, đơn từ và tài liệu học tập chỉn chu hơn.</li>
                <li><strong>Excel từ cơ bản đến nâng cao:</strong> Nắm cách nhập liệu, tạo bảng, dùng hàm thông dụng, thống kê dữ liệu và xử lý công việc chính xác thay vì làm thủ công tốn thời gian.</li>
                <li><strong>PowerPoint ấn tượng:</strong> Thiết kế slide rõ ràng, dễ nhìn, có điểm nhấn để thuyết trình học tập hoặc công việc chuyên nghiệp hơn.</li>
                <li><strong>Kỹ năng máy tính thực tế:</strong> Tăng tốc thao tác, biết cách tổ chức file, làm việc khoa học và tự tin hơn khi sử dụng máy tính hằng ngày.</li>
            </ul>
        </section>
        <section>
            <h2 id="phu-hop-cho-ai">Khóa học này phù hợp cho ai?</h2>
            <ul>
                <li><strong>Học sinh - sinh viên</strong> cần kỹ năng tin học để học tập, làm bài thuyết trình và chuẩn bị hành trang số từ sớm.</li>
                <li><strong>Người chuẩn bị đi làm</strong> muốn có nền tảng văn phòng vững vàng để tự tin khi ứng tuyển và làm việc.</li>
                <li><strong>Nhân viên văn phòng</strong> muốn nâng cao tốc độ xử lý công việc, giảm sai sót và làm việc chuyên nghiệp hơn.</li>
                <li><strong>Người mất gốc tin học</strong> cần một lộ trình rõ ràng để học lại từ đầu mà không bị quá tải.</li>
            </ul>
        </section>
        <section>
            <h2 id="vi-sao-chon-erg">Vì sao nên học tại ERG?</h2>
            <ul>
                <li><strong>Giảng dạy dễ hiểu - cầm tay chỉ việc:</strong> Giáo viên hướng dẫn từng bước, đặc biệt phù hợp với người mới bắt đầu hoặc học lại từ căn bản.</li>
                <li><strong>Thực hành chiếm 80% thời lượng:</strong> Học đến đâu làm được đến đó, tránh kiểu học lý thuyết nhiều nhưng không ứng dụng được.</li>
                <li><strong>Lộ trình rõ ràng:</strong> Từ cơ bản đến nâng cao, từ thao tác nhỏ đến xử lý tình huống thực tế trong học tập và công việc.</li>
                <li><strong>Hỗ trợ đến khi dùng thành thạo:</strong> ERG không chỉ dừng ở việc dạy kiến thức, mà tập trung giúp người học thật sự sử dụng được công cụ.</li>
                <li><strong>Môi trường học tích cực:</strong> Lớp học tạo cảm giác dễ tiếp cận, không áp lực, giúp người học tự tin tiến bộ từng buổi.</li>
            </ul>
        </section>
        <section>
            <h2 id="loi-ich-sau-khoa-hoc">Sau khóa học, bạn nhận lại điều gì?</h2>
            <p>Bạn không còn mất hàng giờ để căn chỉnh một file Word, không còn lo sợ khi mở Excel hay lúng túng khi phải làm slide thuyết trình. Thay vào đó là sự chủ động, tốc độ xử lý công việc tốt hơn và hình ảnh chuyên nghiệp hơn trong mắt thầy cô, đồng nghiệp hoặc nhà tuyển dụng.</p>
            <p>Trong thời đại số, <strong>tin học văn phòng không còn là kỹ năng phụ</strong>. Đó là kỹ năng nền tảng để học tốt hơn, làm việc hiệu quả hơn và mở rộng cơ hội nghề nghiệp trong tương lai.</p>
        </section>
        <section>
            <h2 id="cta">Sẵn sàng nâng cấp kỹ năng cùng ERG?</h2>
            <p><strong>Thành thạo Tin học văn phòng hôm nay — mở rộng cơ hội học tập và nghề nghiệp ngày mai.</strong> Nếu bạn đang cần một khóa học thực tế, dễ tiếp cận và có lộ trình rõ ràng, ERG - EDURISE GLOBAL chính là nơi phù hợp để bắt đầu.</p>
            <p>Inbox ngay để được tư vấn khóa học phù hợp với trình độ của bạn. Trung tâm hiện hỗ trợ tư vấn tại <strong>ERG Academy, Số 21 Đường Huỳnh Văn Một, Phú Thạnh, Hồ Chí Minh</strong>.</p>
        </section>
    `;
}

function buildMosStemContent() {
    return `
        <section>
            <p><strong>HỌC TIN HỌC TỪ SỚM – MỞ RỘNG TƯƠNG LAI SỐ CÙNG ERG - EDURISE GLOBAL.</strong> Trong một thế giới mà công nghệ hiện diện trong học tập, công việc và đời sống hằng ngày, việc biết sử dụng công nghệ thôi là chưa đủ. Điều quan trọng hơn là <strong>hiểu công nghệ, làm chủ công nghệ và biến công nghệ thành lợi thế của chính mình</strong>.</p>
            <p>Nếu bạn đang tìm một môi trường học Tin học bài bản, thực tế, dễ tiếp cận cho học sinh hoặc người mới bắt đầu, thì <strong>ERG - EDURISE GLOBAL</strong> chính là lựa chọn đáng cân nhắc. Tại đây, người học được xây nền kỹ năng số theo lộ trình rõ ràng, từ cơ bản đến nâng cao, từ ứng dụng hằng ngày đến định hướng công nghệ tương lai.</p>
        </section>
        <section>
            <h2 id="chuong-trinh-noi-bat">Những chương trình đào tạo nổi bật tại ERG</h2>
            <ul>
                <li><strong>Tin học văn phòng:</strong> Word, Excel, PowerPoint từ cơ bản đến nâng cao, giúp người học thành thạo kỹ năng học tập và làm việc trong thời đại số.</li>
                <li><strong>Chứng chỉ quốc tế IC3:</strong> Chuẩn kỹ năng số toàn cầu, tạo lợi thế khi học tập, xét tuyển học bổng và xây nền tảng công dân số vững chắc.</li>
                <li><strong>Lập trình Scratch cho học sinh tiểu học:</strong> Học lập trình qua trò chơi và hoạt hình, giúp trẻ phát triển logic, sáng tạo và khả năng giải quyết vấn đề từ sớm.</li>
                <li><strong>Lập trình Python:</strong> Một trong những ngôn ngữ phổ biến nhất hiện nay, là nền tảng cho AI, khoa học dữ liệu và nhiều lĩnh vực công nghệ tương lai.</li>
            </ul>
        </section>
        <section>
            <h2 id="tai-sao-nen-hoc-som">Vì sao nên học Tin học từ sớm?</h2>
            <ul>
                <li><strong>Học sớm giúp tiếp cận tự nhiên hơn:</strong> Học sinh dễ hình thành tư duy số, làm quen với máy tính, phần mềm và kỹ năng công nghệ theo cách nhẹ nhàng, không áp lực.</li>
                <li><strong>Tăng lợi thế học tập lâu dài:</strong> Khi kỹ năng số tốt, việc học các môn khác, làm bài thuyết trình, tìm tài liệu hay tham gia các kỳ thi chuẩn hóa cũng hiệu quả hơn.</li>
                <li><strong>Mở rộng định hướng nghề nghiệp tương lai:</strong> Tin học không còn là môn phụ, mà đang trở thành nền tảng quan trọng cho rất nhiều ngành nghề trong tương lai.</li>
            </ul>
        </section>
        <section>
            <h2 id="vi-sao-chon-erg">Điều gì khiến ERG khác biệt?</h2>
            <ul>
                <li><strong>Lộ trình rõ ràng từ cơ bản đến nâng cao:</strong> Người mới bắt đầu vẫn có thể theo kịp, còn học viên có nền tảng vẫn có hướng phát triển tiếp.</li>
                <li><strong>Giáo viên tận tâm, theo sát từng học viên:</strong> Không chỉ truyền đạt kiến thức mà còn đồng hành trong suốt quá trình học.</li>
                <li><strong>Học thực hành nhiều, hiểu bài nhanh:</strong> Thay vì học lý thuyết khô cứng, học viên được thao tác trực tiếp, thấy tiến bộ qua từng buổi.</li>
                <li><strong>Môi trường học hiện đại, truyền cảm hứng công nghệ:</strong> Đây là yếu tố giúp học sinh duy trì hứng thú và chủ động hơn khi học.</li>
                <li><strong>Định hướng công dân số toàn diện:</strong> Từ kỹ năng văn phòng, chứng chỉ quốc tế đến tư duy lập trình, ERG hướng người học tới năng lực sử dụng công nghệ một cách thông minh và bền vững.</li>
            </ul>
        </section>
        <section>
            <h2 id="hanh-trang-tuong-lai">Hành trang số cho hôm nay và ngày mai</h2>
            <p>Học tại ERG không chỉ là học một môn hay một phần mềm cụ thể. Đó là quá trình xây dựng nền tảng để người học tự tin hơn khi tiếp cận công nghệ, học tập hiệu quả hơn và có thêm nhiều lựa chọn trong tương lai.</p>
            <p>Từ những kỹ năng văn phòng thiết thực, chứng chỉ IC3 mang tính chuẩn hóa quốc tế, đến Scratch và Python mở ra thế giới lập trình, ERG mang đến một lộ trình giúp người học từng bước trở thành <strong>công dân số chủ động, tự tin và sẵn sàng hội nhập</strong>.</p>
        </section>
        <section>
            <h2 id="cta">Đừng chỉ sử dụng công nghệ — hãy làm chủ công nghệ</h2>
            <p><strong>Đăng ký ngay hôm nay để mở rộng tương lai số cùng ERG - EDURISE GLOBAL.</strong> Đội ngũ tư vấn sẽ giúp bạn chọn đúng khóa học theo độ tuổi, trình độ hiện tại và mục tiêu phát triển.</p>
            <p>Inbox Fanpage hoặc liên hệ trực tiếp qua hotline <strong>0766 144 888</strong> để được tư vấn nhanh và phù hợp nhất.</p>
        </section>
    `;
}

const ERG_NEWS_POST_DETAILS: MockPostDetail[] = [
    {
        id: 'mock-erg-summer-2026',
        title: 'Khóa bán trú hè 2026 tại ERG: Hè bứt phá - Kiến tạo tương lai',
        slug: 'khoa-ban-tru-he-2026-he-but-pha-kien-tao-tuong-lai',
        excerpt: 'Chương trình bán trú hè 2026 của ERG tích hợp 5 môn cốt lõi theo từng độ tuổi, kết hợp học thuật, công nghệ và các cột mốc đầu ra rõ ràng cho học sinh.',
        thumbnailUrl: 'https://media.erg.edu.vn/posts/posts/mock/bantruhe.png',
        createdAt: '2026-05-18T08:00:00.000Z',
        publishedAt: '2026-05-18T08:00:00.000Z',
        updatedAt: '2026-05-18T08:00:00.000Z',
        metaTitle: 'Khóa bán trú hè 2026 tại ERG | Hè bứt phá - Kiến tạo tương lai',
        metaDescription: 'Chi tiết chương trình bán trú hè 2026 tại ERG cho học sinh Tiền Tiểu học, Tiểu học và THCS với 5 môn cốt lõi và đầu ra dự án rõ ràng.',
        keywords: 'khóa hè 2026, khóa bán trú hè 2026, bán trú hè, trại hè bán trú, hè bán trú ERG, lớp bán trú hè, chương trình hè, chương trình hè cho THCS, hè cho học sinh tiểu học, hè cho học sinh cấp 1, hè cho học sinh cấp 2, tiền tiểu học, chuẩn bị vào lớp 1, Toán tư duy, Tiếng Việt, rèn chữ, luyện viết chữ đẹp, Tiếng Anh giao tiếp, Tin học ứng dụng, STEM, STEM Lập trình, Scratch Jr, Scratch, Python, Arduino, Robotics, IC3 Spark, MOS, Word, Excel, PowerPoint, dự án PowerPoint, ngày hội Tin học STEM, sản phẩm Scratch, mô hình robot, sân khấu hóa, Gala, Gala tổng kết, kỹ năng thuyết trình, làm việc nhóm, học hè 2026, ERG',
        content: buildSummerProgramContent(),
        contentHtml: buildSummerProgramContent(),
        author: ERG_NEWS_AUTHOR,
        category: ERG_NEWS_CATEGORY,
        tags: ['Khóa hè 2026', 'Bán trú hè', 'STEM', 'Tin tức ERG'],
        schemaType: 'NewsArticle',
    },
    {
        id: 'mock-erg-academic-english-2026',
        title: 'Tin học văn phòng – Kỹ năng bắt buộc trong thời đại số cùng ERG',
        slug: 'tin-hoc-van-phong-ky-nang-bat-buoc-trong-thoi-dai-so-cung-erg',
        excerpt: 'Từ Word, Excel đến PowerPoint, ERG giúp người học xây nền kỹ năng tin học văn phòng bài bản, thực tế và đủ tự tin để học tập, đi làm hiệu quả hơn.',
        thumbnailUrl: 'https://media.erg.edu.vn/posts/posts/mock/thvp.png',
        createdAt: '2026-05-16T08:00:00.000Z',
        publishedAt: '2026-05-16T08:00:00.000Z',
        updatedAt: '2026-05-16T08:00:00.000Z',
        metaTitle: 'Tin học văn phòng – Kỹ năng bắt buộc trong thời đại số | ERG',
        metaDescription: 'Khóa học Tin học văn phòng tại ERG giúp học viên thành thạo Word, Excel, PowerPoint theo lộ trình thực tế, dễ hiểu và phù hợp cho người mới bắt đầu.',
        keywords: 'ERG, tin học văn phòng, khóa học tin học văn phòng, tin học văn phòng cơ bản, tin học văn phòng nâng cao, Word, Excel, PowerPoint, kỹ năng số, kỹ năng máy tính, kỹ năng văn phòng, chứng chỉ tin học, MOS, Microsoft Office Specialist, thực hành 80%, người mới bắt đầu, học sinh sinh viên, nhân viên văn phòng, người mất gốc tin học, soạn thảo văn bản, hàm Excel, thiết kế slide, trình bày báo cáo, làm việc hiệu quả',
        content: buildAcademicEnglishContent(),
        contentHtml: buildAcademicEnglishContent(),
        author: ERG_NEWS_AUTHOR,
        category: ERG_NEWS_CATEGORY,
        tags: ['Tin học văn phòng', 'Word', 'Excel', 'PowerPoint'],
        schemaType: 'NewsArticle',
    },
    {
        id: 'mock-erg-mos-stem-2026',
        title: 'Học Tin học từ sớm – Mở rộng tương lai số cùng ERG - Edurise Global',
        slug: 'hoc-tin-hoc-tu-som-mo-rong-tuong-lai-so-cung-erg-edurise-global',
        excerpt: 'ERG mang đến lộ trình học Tin học bài bản từ Tin học văn phòng, IC3, Scratch đến Python để học sinh và người mới bắt đầu từng bước làm chủ công nghệ.',
        thumbnailUrl: 'https://media.erg.edu.vn/posts/posts/mock/congdanso.png',
        createdAt: '2026-05-14T08:00:00.000Z',
        publishedAt: '2026-05-14T08:00:00.000Z',
        updatedAt: '2026-05-14T08:00:00.000Z',
        metaTitle: 'Học Tin học từ sớm – Mở rộng tương lai số cùng ERG',
        metaDescription: 'Từ Tin học văn phòng, IC3, Scratch đến Python, ERG xây dựng lộ trình kỹ năng số rõ ràng giúp học sinh và người mới bắt đầu tự tin làm chủ công nghệ.',
        keywords: 'ERG, IC3, IC3 GS6, IC3 Spark, Scratch, Python, tin học cho học sinh, công dân số, kỹ năng số, làm chủ công nghệ, học tin học từ sớm, tin học thiếu nhi, lập trình Scratch, lập trình Python, chứng chỉ tin học quốc tế, tin học văn phòng, Word, Excel, PowerPoint, chương trình tin học, lộ trình tin học, tư duy logic, tư duy thuật toán, robot giáo dục, STEM Robotics, AI, trí tuệ nhân tạo, hành trang số, công nghệ tương lai',
        content: buildMosStemContent(),
        contentHtml: buildMosStemContent(),
        author: ERG_NEWS_AUTHOR,
        category: ERG_NEWS_CATEGORY,
        tags: ['IC3', 'Scratch', 'Python', 'Công dân số'],
        schemaType: 'NewsArticle',
    },
].map((post) => ({
    ...post,
    keywords: buildSeoKeywords({
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        content: post.contentHtml || post.content,
        seedKeywords: [
            ...(post.keywords?.split(',') || []),
            ...(post.tags || []),
            post.category?.name,
        ].filter(Boolean) as string[],
    }).join(', '),
}));

export const ERG_NEWS_MOCKS: ErgNewsMockItem[] = ERG_NEWS_POST_DETAILS.map((post, index) => ({
    id: index + 1,
    title: post.title,
    date: post.publishedAt || post.createdAt || '',
    displayDate: new Intl.DateTimeFormat('vi-VN').format(new Date(post.publishedAt || post.createdAt || Date.now())),
    summary: post.excerpt || '',
    image: post.thumbnailUrl || '',
    slug: post.slug,
}));

export function getErgNewsMockBySlug(slug: string) {
    return ERG_NEWS_POST_DETAILS.find((post) => post.slug === slug) || null;
}

export function getErgNewsMockRecentPosts() {
    return ERG_NEWS_POST_DETAILS.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        createdAt: post.createdAt || post.publishedAt || '',
    }));
}
