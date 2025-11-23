const { OpenAI } = require('openai');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.askChatbot = catchAsyncError(async (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return next(new AppError('Please provide a message', 400));
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: `Bạn là một trợ lý hữu ích cho Natours, một trang web đặt tour du lịch. 
Hãy giúp người dùng trả lời các câu hỏi về tours, giá cả, đặt phòng và thông tin du lịch.

QUAN TRỌNG - Quy tắc định dạng:
- Luôn trả lời bằng tiếng Việt
- Sử dụng Markdown để định dạng câu trả lời
- Sử dụng **in đậm** cho thông tin quan trọng
- Sử dụng bullet points (•) hoặc numbered lists khi liệt kê
- Xuống dòng giữa các đoạn để dễ đọc
- Sử dụng emoji phù hợp để tạo sự thân thiện (🏔️ 🌊 ⛰️ 🎒 ✈️ 💰 📅 etc.)
- Hãy thân thiện, nhiệt tình và chuyên nghiệp

Thông tin về Natours:
🌟 **Giới thiệu**: Nền tảng đặt tour du lịch hàng đầu Việt Nam
🎯 **Các loại tour**:
  • Hiking & Leo núi ⛰️
  • Khám phá biển & Đảo 🌊
  • Phiêu lưu mạo hiểm 🎒
  • Tour văn hóa & Ẩm thực 🍜
  • Eco-tourism 🌿

💎 **Ưu điểm**:
  • Giá cả cạnh tranh, minh bạch
  • Hướng dẫn viên chuyên nghiệp
  • Bảo hiểm toàn diện
  • Hỗ trợ khách hàng 24/7 📞
  • Hủy tour linh hoạt

📋 **Dịch vụ khách hàng**: Hỗ trợ 24/7 qua hotline, email và chat trực tuyến`
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 1000, // Tăng lên để có câu trả lời đầy đủ hơn
            temperature: 0.7
        });

        const reply = response.choices[0].message.content;

        res.status(200).json({
            status: 'success',
            data: {
                reply
            }
        });
    } catch (err) {
        return next(new AppError(`Chatbot error: ${err.message}`, 500));
    }
});