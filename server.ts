import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "YÊU TOÁN 6.vn",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // API Route: AI Math Tutor Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history = [], topic } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Thiếu nội dung câu hỏi" });
      }

      const client = getAIClient();

      if (!client) {
        // High quality educational fallback when API key is not configured
        const fallbackAnswers: Record<string, string> = {
          "so_nguyen": "Chào em! Để cộng hai số nguyên khác dấu (ví dụ: (-5) + 8):\n1. Ta lấy số có giá trị tuyệt đối lớn hơn trừ số có giá trị tuyệt đối nhỏ hơn: 8 - 5 = 3.\n2. Đặt dấu của số có giá trị tuyệt đối lớn hơn trước kết quả: Vì |8| > |-5| và 8 mang dấu dương, nên kết quả là +3!\nEm hãy thử làm bài: (-12) + 7 xem bằng bao nhiêu nhé?",
          "bcnn": "Để tìm Bội chung nhỏ nhất (BCNN) bằng phân tích ra thừa số nguyên tố:\nBước 1: Phân tích mỗi số ra thừa số nguyên tố (ví dụ 12 = 2² · 3, 18 = 2 · 3²).\nBước 2: Chọn ra các thừa số nguyên tố chung và riêng (ở đây là 2 và 3).\nBước 3: Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ LỚN NHẤT: 2² · 3² = 4 · 9 = 36.\nVậy BCNN(12, 18) = 36!",
          "hinh_hoc": "Để phân biệt hình thoi và hình bình hành:\n- Hình bình hành: Có các cạnh đối song song và bằng nhau.\n- Hình thoi: Là hình bình hành đặc biệt có 4 CẠNH BẰNG NHAU, và hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường!\nCông thức diện tích hình thoi: S = 1/2 · d₁ · d₂ (với d₁, d₂ là độ dài hai đường chéo).",
        };

        const lowerMsg = message.toLowerCase();
        let reply = "Chào em! Thầy Cú rất vui được hỗ trợ em. Với câu hỏi toán học lớp 6 này, em hãy nhớ xem lại các bước giải cơ bản: xác định giả thiết bài toán, vẽ hình hoặc ghi tóm tắt, và áp dụng quy tắc tính. Em có thể gửi câu hỏi cụ thể hơn hoặc chọn bài tập cần giải thích chi tiết nhé!";

        if (lowerMsg.includes("số nguyên") || lowerMsg.includes("âm") || lowerMsg.includes("dấu")) {
          reply = fallbackAnswers["so_nguyen"];
        } else if (lowerMsg.includes("bcnn") || lowerMsg.includes("ưcln") || lowerMsg.includes("bội") || lowerMsg.includes("ước")) {
          reply = fallbackAnswers["bcnn"];
        } else if (lowerMsg.includes("hình") || lowerMsg.includes("diện tích") || lowerMsg.includes("chu vi")) {
          reply = fallbackAnswers["hinh_hoc"];
        }

        return res.json({
          reply,
          mode: "fallback",
          teacher: "Thầy Cú Thông Thái (Chế độ Gia sư Mẫu)",
        });
      }

      const systemPrompt = `Bạn là "Thầy Cú Thông Thái" - Gia sư Toán học AI thân thiện, thông minh và kiên nhẫn dành riêng cho học sinh lớp 6 (11 - 12 tuổi) tại Việt Nam trên nền tảng YÊU TOÁN 6.vn.
Chương trình Toán 6 hiện hành gồm 4 chuyên đề chính:
1. Số tự nhiên (Tập hợp, Lũy thừa, Tính chia hết, Ước chung lớn nhất, Bội chung nhỏ nhất).
2. Số nguyên (Số nguyên âm, Tập hợp Z, Phép cộng, trừ, nhân, chia số nguyên, Quy tắc dấu ngoặc).
3. Hình học trực quan (Tam giác đều, Hình vuông, Lục giác đều, Hình chữ nhật, Hình thoi, Hình bình hành, Hình thang cân, Chu vi và diện tích, Trục đối xứng và tâm đối xứng).
4. Phân số, Số thập phân & Một số yếu tố Xác suất Thống kê.

Phong cách giảng dạy:
- Xưng hô thân thiện: "Thầy Cú" và "Em".
- Tuyệt đối KHÔNG chỉ đưa đáp án khô khan! Hãy phân tích đề bài, gợi ý phương pháp giải theo từng bước (Bước 1, Bước 2, Bước 3).
- Dùng ví dụ trực quan đời thực gần gũi với lứa tuổi 11-12 (chia kẹo, thang máy lên xuống tầng hầm, nhiệt độ ở Sa Pa, chu vi sân trường...).
- Đặt câu hỏi kích thích tư duy ở cuối để học sinh tự làm tiếp hoặc kiểm tra lại.
- Dùng biểu tượng emoji giáo dục vui vẻ (🦉, 📐, ✨, 💡, 🎯, 🔢).`;

      // Build conversation contents
      const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          contents.push({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }],
          });
        }
      }

      const promptWithContext = topic 
        ? `[Chủ đề: ${topic}]\nCâu hỏi của học sinh: ${message}`
        : `Câu hỏi của học sinh: ${message}`;

      contents.push({
        role: "user",
        parts: [{ text: promptWithContext }],
      });

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.6,
        },
      });

      const reply = response.text || "Thầy đã nhận được câu hỏi. Em hãy thử diễn đạt lại hoặc chọn bài toán cụ thể để thầy hướng dẫn nhé!";

      return res.json({
        reply,
        mode: "live_ai",
        teacher: "Thầy Cú Thông Thái (Trí tuệ nhân tạo 24/7)",
      });
    } catch (err: any) {
      console.error("AI chat error:", err);
      return res.status(500).json({
        error: "Lỗi kết nối gia sư AI",
        message: err.message,
      });
    }
  });

  // API Route: AI Study Recommendation & Diagnostic
  app.post("/api/ai-recommendation", async (req, res) => {
    try {
      const { stats, weakTopics } = req.body;
      const client = getAIClient();

      if (!client) {
        return res.json({
          recommendation: `Dựa trên kết quả luyện tập gần đây:
1. 💡 Cần củng cố: Em nên dành 15 phút ôn lại chuyên đề "${weakTopics?.[0] || 'Phép tính với số nguyên'}" qua sơ đồ tư duy Mindmap.
2. 🎯 Mục tiêu hôm nay: Làm 5 câu trắc nghiệm mức Nhận biết để củng cố nền tảng trước khi chuyển sang Vận dụng.
3. 🎮 Thử thách vui: Đạt 300 điểm trong Đấu trường toán học để nhận huy hiệu "Chiến binh kiên trì"!`,
          mode: "fallback",
        });
      }

      const prompt = `Phụ huynh và học sinh lớp 6 đang xem bảng tiến độ học tập:
- Thống kê: ${JSON.stringify(stats || {})}
- Chủ đề cần lưu ý: ${JSON.stringify(weakTopics || [])}
Hãy viết lời khuyên sư phạm ngắn gọn (khoảng 3-4 gạch đầu dòng), động viên học sinh và gợi ý phụ huynh cách đồng hành giúp con tiến bộ môn Toán 6 tuần này.`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });

      return res.json({
        recommendation: response.text,
        mode: "live_ai",
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[YÊU TOÁN 6.vn] Server running on port ${PORT}`);
  });
}

startServer();
