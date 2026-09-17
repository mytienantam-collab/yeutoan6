import { WorksheetItem } from '../types';

export const WORKSHEETS_DATA: WorksheetItem[] = [
  {
    id: 'ws-01',
    title: 'Phiếu học tập Tuần 3: Dấu hiệu chia hết & Phân tích thừa số nguyên tố',
    chapterCode: 'CH-01',
    chapterTitle: 'Số tự nhiên',
    targetWeek: 'Tuần 03 - Học kỳ 1',
    grade: 'Toán 6',
    difficulty: 'Cơ bản đến Khá',
    summary: 'Thiết kế phong cách Canva hiện đại với các khung điền thông tin, sơ đồ hình cây để phân tích thừa số nguyên tố và ô vẽ sơ đồ.',
    questionCount: 6,
    previewColor: 'from-blue-500 to-indigo-600',
    sections: [
      {
        title: 'Phần I: Khởi động & Điền số (2.0 điểm)',
        description: 'Điền chữ số thích hợp vào dấu * để hoàn thiện các phát biểu sau:',
        tasks: [
          { number: '1.1', prompt: 'Để số 3*5 chia hết cho 9 thì chữ số * phải là: ..........', spaceHeight: 'h-8' },
          { number: '1.2', prompt: 'Số 420 phân tích ra thừa số nguyên tố là: 420 = ....................', spaceHeight: 'h-8' },
        ],
      },
      {
        title: 'Phần II: Thực hiện phép tính hợp lý (4.0 điểm)',
        description: 'Trình bày chi tiết từng bước giải vào khung bên dưới:',
        tasks: [
          { number: '2.1', prompt: 'Tính hợp lý: A = 35 · 68 + 35 · 32 - 150', spaceHeight: 'h-20' },
          { number: '2.2', prompt: 'Tìm số tự nhiên x biết: 120 - 5 · (x + 3) = 45', spaceHeight: 'h-24' },
        ],
      },
      {
        title: 'Phần III: Vận dụng thực tế - Chia đội thi đấu (4.0 điểm)',
        description: 'Đọc kỹ đề bài và lập luận sư phạm:',
        tasks: [
          {
            number: '3.1',
            prompt: 'Khối 6 có 144 học sinh nam và 120 học sinh nữ tham gia hoạt động dã ngoại. Thầy tổng phụ trách muốn chia thành các tổ sao cho số nam và nữ ở mỗi tổ đều bằng nhau. Hỏi có thể chia được nhiều nhất bao nhiêu tổ? Khi đó mỗi tổ có bao nhiêu nam và bao nhiêu nữ?',
            spaceHeight: 'h-32',
          },
        ],
      },
    ],
    solutionGuide: [
      '1.1: 3 + * + 5 = 8 + * chia hết cho 9 => * = 1.',
      '1.2: 420 = 2² · 3 · 5 · 7.',
      '2.1: A = 35 · (68 + 32) - 150 = 35 · 100 - 150 = 3500 - 150 = 3350.',
      '2.2: 5 · (x + 3) = 120 - 45 = 75 => x + 3 = 15 => x = 12.',
      '3.1: Số tổ nhiều nhất là ƯCLN(144, 120) = 24 tổ. Mỗi tổ có: 144 : 24 = 6 nam và 120 : 24 = 5 nữ.',
    ],
  },
  {
    id: 'ws-02',
    title: 'Phiếu học tập Tuần 7: Chinh phục Số nguyên âm & Phép tính trên Z',
    chapterCode: 'CH-02',
    chapterTitle: 'Số nguyên',
    targetWeek: 'Tuần 07 - Học kỳ 1',
    grade: 'Toán 6',
    difficulty: 'Thông hiểu & Vận dụng',
    summary: 'Mẫu thiết kế màu cam san hô ấm áp, kèm trục số kẻ sẵn ô ly cho học sinh vẽ biểu diễn điểm và thực hiện phép trừ số nguyên.',
    questionCount: 5,
    previewColor: 'from-amber-500 to-orange-600',
    sections: [
      {
        title: 'Phần I: Trục số & Số đối (3.0 điểm)',
        description: 'Biểu diễn và xác định khoảng cách trên trục số:',
        tasks: [
          { number: '1.1', prompt: 'Viết số đối của các số sau: -15; 0; -(-8); 2024.', spaceHeight: 'h-10' },
          { number: '1.2', prompt: 'Vẽ trục số và biểu diễn các điểm A(-4), B(3), C(-1). Tính độ dài đoạn thẳng AB.', spaceHeight: 'h-24' },
        ],
      },
      {
        title: 'Phần II: Phá ngoặc & Tính giá trị (4.0 điểm)',
        description: 'Áp dụng quy tắc dấu ngoặc một cách thuần thục:',
        tasks: [
          { number: '2.1', prompt: 'Tính: P = (-25) + 19 + (-75) + 81', spaceHeight: 'h-20' },
          { number: '2.2', prompt: 'Bỏ ngoặc rồi tính: Q = (2024 - 157) - (2024 - 157 + 89)', spaceHeight: 'h-20' },
        ],
      },
      {
        title: 'Phần III: Bài toán thực tế tàu ngầm & máy bay (3.0 điểm)',
        tasks: [
          {
            number: '3.1',
            prompt: 'Một tàu ngầm đang ở độ sâu 120 m dưới mực nước biển. Sau đó tàu nổi lên 45 m, rồi lại lặn sâu thêm 30 m nữa. Hãy dùng số nguyên để tính độ cao hiện tại của tàu ngầm so với mực nước biển.',
            spaceHeight: 'h-28',
          },
        ],
      },
    ],
    solutionGuide: [
      '1.1: Số đối: 15; 0; -8; -2024.',
      '1.2: Độ dài AB = 3 - (-4) = 7 đơn vị.',
      '2.1: P = [(-25) + (-75)] + (19 + 81) = -100 + 100 = 0.',
      '2.2: Q = 2024 - 157 - 2024 + 157 - 89 = (2024 - 2024) + (-157 + 157) - 89 = -89.',
      '3.1: Vị trí ban đầu: -120 m. Sau khi nổi: -120 + 45 = -75 m. Sau khi lặn tiếp: -75 - 30 = -105 m (sâu 105 m dưới mực nước biển).',
    ],
  },
  {
    id: 'ws-03',
    title: 'Phiếu học tập Tuần 11: Chu vi & Diện tích Hình thoi, Hình bình hành',
    chapterCode: 'CH-03',
    chapterTitle: 'Hình học trực quan',
    targetWeek: 'Tuần 11 - Học kỳ 1',
    grade: 'Toán 6',
    difficulty: 'Vận dụng thực tế',
    summary: 'Mẫu thiết kế xanh ngọc lục bảo tươi mát, có lưới ô vuông mô phỏng sân trường và bồn hoa hình thoi cho bài toán trang trí kiến trúc.',
    questionCount: 4,
    previewColor: 'from-emerald-500 to-teal-600',
    sections: [
      {
        title: 'Phần I: Nhận dạng & Điền công thức (3.0 điểm)',
        tasks: [
          { number: '1.1', prompt: 'Viết công thức tính chu vi và diện tích của hình thoi có cạnh a và 2 đường chéo d1, d2.', spaceHeight: 'h-12' },
          { number: '1.2', prompt: 'Một hình bình hành có đáy 15 cm và chiều cao tương ứng 8 cm. Tính diện tích của nó.', spaceHeight: 'h-12' },
        ],
      },
      {
        title: 'Phần II: Dự án bồn hoa hình thoi trường em (7.0 điểm)',
        tasks: [
          {
            number: '2.1',
            prompt: 'Nhà trường thiết kế một bồn hoa hình thoi có độ dài hai đường chéo là 6 m và 4 m. \na) Tính diện tích của bồn hoa. \nb) Biết mỗi mét vuông trồng được 8 cây hoa hồng, mỗi cây có giá 15.000 đồng. Tính tổng số tiền mua hoa để trồng kín bồn hoa đó.',
            spaceHeight: 'h-36',
          },
        ],
      },
    ],
    solutionGuide: [
      '1.1: Chu vi = 4a; Diện tích = 1/2 · d1 · d2.',
      '1.2: Diện tích hình bình hành S = a · h = 15 · 8 = 120 cm².',
      '2.1a: Diện tích bồn hoa S = 1/2 · 6 · 4 = 12 m².',
      '2.1b: Tổng số cây hoa = 12 · 8 = 96 cây. Tổng số tiền = 96 · 15.000 = 1.440.000 đồng.',
    ],
  },
  {
    id: 'ws-04',
    title: 'Phiếu học tập Tuần 16: Phân số & Biểu đồ cột thống kê',
    chapterCode: 'CH-04',
    chapterTitle: 'Phân số & Thống kê',
    targetWeek: 'Tuần 16 - Học kỳ 2',
    grade: 'Toán 6',
    difficulty: 'Tổng hợp',
    summary: 'Mẫu thiết kế phong cách Canva hiện đại với bảng biểu, ô vẽ cột biểu đồ kép và bài toán khảo sát sở thích thể thao lớp 6A.',
    questionCount: 4,
    previewColor: 'from-indigo-500 to-purple-600',
    sections: [
      {
        title: 'Phần I: Tính toán phân số (4.0 điểm)',
        tasks: [
          { number: '1.1', prompt: 'Thực hiện phép tính: M = 3/7 + (-5/14) - 1/2', spaceHeight: 'h-20' },
          { number: '1.2', prompt: 'Tìm x biết: 2/3 · x - 1/4 = -5/12', spaceHeight: 'h-24' },
        ],
      },
      {
        title: 'Phần II: Đọc hiểu và vẽ biểu đồ dữ liệu (6.0 điểm)',
        tasks: [
          {
            number: '2.1',
            prompt: 'Lớp 6A có 40 học sinh. Kết quả khảo sát môn thể thao yêu thích: Bóng đá: 18 bạn, Cầu lông: 12 bạn, Bơi lội: 6 bạn, Bóng rổ: 4 bạn. \na) Tính tỉ số phần trăm học sinh yêu thích môn Bóng đá so với cả lớp. \nb) Xác suất thực nghiệm chọn ngẫu nhiên một bạn thích Cầu lông là bao nhiêu?',
            spaceHeight: 'h-32',
          },
        ],
      },
    ],
    solutionGuide: [
      '1.1: M = 6/14 - 5/14 - 7/14 = -6/14 = -3/7.',
      '1.2: 2/3 · x = -5/12 + 1/4 = -5/12 + 3/12 = -2/12 = -1/6 => x = (-1/6) : (2/3) = -1/4.',
      '2.1a: Tỉ số % thích Bóng đá: (18 / 40) · 100% = 45%.',
      '2.1b: Xác suất thực nghiệm thích Cầu lông: 12 / 40 = 3/10 = 30%.',
    ],
  },
];
