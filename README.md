# Người Yêu Ảo - Ứng dụng trò chuyện với người yêu ảo

Người Yêu Ảo là một ứng dụng web cho phép bạn tạo và trò chuyện với một nhân vật ảo. Ứng dụng sử dụng AI để tạo ra các cuộc trò chuyện tự nhiên, giúp bạn có trải nghiệm giao tiếp thú vị và chân thực.

## Tính năng

- **Tạo nhân vật**: Tùy chỉnh tên, tuổi, giới tính, tính cách và sở thích của nhân vật
- **Trò chuyện**: Giao tiếp với nhân vật thông qua tin nhắn văn bản, emoji và hình ảnh
- **Tin nhắn thoại**: Gửi tin nhắn bằng giọng nói
- **Nhật ký**: Lưu lại các khoảnh khắc đặc biệt trong cuộc trò chuyện
- **Mini game**: Chơi các trò chơi nhỏ để tăng mức độ thân thiết
- **Chế độ tối**: Giao diện tối giúp giảm mỏi mắt khi sử dụng vào ban đêm
- **Sự kiện đặc biệt**: Nhân vật sẽ có phản ứng đặc biệt vào các ngày lễ
- **Nhắc nhở hàng ngày**: Thông báo để nhắc bạn trò chuyện với nhân vật
- **Theo dõi tâm trạng**: Hiển thị tâm trạng của nhân vật dựa trên nội dung trò chuyện
- **Sao lưu và khôi phục**: Lưu trữ dữ liệu trên Google Drive

## Cài đặt

### Phương pháp 1: Sử dụng trực tiếp từ GitHub Pages

Truy cập ứng dụng tại: [https://ruandejuxian.github.io/nguoiyeuao/](https://ruandejuxian.github.io/nguoiyeuao/)

### Phương pháp 2: Cài đặt cục bộ

1. Tải xuống mã nguồn:
   ```
   git clone https://github.com/ruandejuxian/nguoiyeuao.git
   ```

2. Mở file `index.html` trong trình duyệt web của bạn.

## Cấu hình API

Ứng dụng sử dụng OpenAI API để tạo ra các cuộc trò chuyện. Bạn cần cấu hình API key để sử dụng đầy đủ tính năng:

1. Đăng ký tài khoản tại [OpenAI](https://platform.openai.com/signup)
2. Tạo API key tại [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. Trong ứng dụng, vào tab "Cài Đặt" và nhập API key của bạn
4. Nhấn "Lưu API Key" để hoàn tất cấu hình

**Lưu ý**: API key của bạn được lưu trữ cục bộ trong trình duyệt và không được gửi đến bất kỳ máy chủ nào khác ngoài OpenAI.

## Cấu hình Google Drive (tùy chọn)

Để sử dụng tính năng sao lưu và khôi phục dữ liệu qua Google Drive:

1. Tạo dự án mới tại [Google Cloud Console](https://console.cloud.google.com/)
2. Bật Google Drive API cho dự án
3. Tạo OAuth 2.0 Client ID
4. Cập nhật các giá trị sau trong file `js/config.js`:
   ```javascript
   GOOGLE_API: {
       API_KEY: 'YOUR_API_KEY',
       CLIENT_ID: 'YOUR_CLIENT_ID',
       ...
   }
   ```

## Sử dụng

### Tạo nhân vật

1. Mở ứng dụng và chọn tab "Tạo Nhân Vật"
2. Điền thông tin nhân vật: tên, tuổi, giới tính, tính cách và sở thích
3. Chọn avatar cho nhân vật
4. Nhấn "Tạo Nhân Vật" để hoàn tất

### Trò chuyện

1. Sau khi tạo nhân vật, bạn sẽ được chuyển đến tab "Chat"
2. Nhập tin nhắn vào ô nhập liệu và nhấn nút gửi
3. Sử dụng nút emoji để chèn biểu tượng cảm xúc
4. Sử dụng nút hình ảnh để gửi hình ảnh
5. Sử dụng nút microphone để gửi tin nhắn thoại

### Sử dụng chế độ tối

1. Vào tab "Cài Đặt"
2. Trong phần "Giao diện", bật công tắc "Chế độ tối"

### Sao lưu và khôi phục dữ liệu

1. Vào tab "Cài Đặt"
2. Trong phần "Google Drive", nhấn "Đăng nhập với Google"
3. Sau khi đăng nhập, bạn có thể sử dụng các nút "Sao lưu dữ liệu" và "Khôi phục dữ liệu"

## Cấu trúc thư mục

```
nguoiyeuao/
├── css/
│   └── style.css
├── js/
│   ├── additional-features.js
│   ├── character.js
│   ├── chat.js
│   ├── config.js
│   ├── diary.js
│   ├── game.js
│   ├── google-api.js
│   ├── main.js
│   ├── storage.js
│   ├── ui.js
│   └── utils.js
├── img/
│   ├── avatar1.png
│   ├── avatar2.png
│   ├── avatar3.png
│   ├── avatar4.png
│   ├── default-avatar.png
│   └── favicon.ico
├── index.html
└── README.md
```

## Các cải tiến đã thực hiện

So với phiên bản gốc, dự án đã được cải tiến với:

1. **Sửa lỗi nút "Tạo Nhân Vật Ngay"** - Nút này giờ đây hoạt động chính xác để chuyển sang trang tạo nhân vật
2. **Thêm tính năng gửi emoji và hình ảnh** - Người dùng có thể gửi emoji và hình ảnh trong chat
3. **Sửa tính năng đăng nhập Google** - Cập nhật để sử dụng Google Identity Services mới nhất
4. **Cải thiện phản hồi AI** - Làm cho cuộc trò chuyện tự nhiên hơn, bớt "cứng"
5. **Nâng cấp giao diện** - Thiết kế hiện đại hơn với gradient, shadow và hiệu ứng
6. **Thêm nhiều tính năng mới** - Chế độ tối, tin nhắn thoại, sự kiện đặc biệt, nhắc nhở hàng ngày, theo dõi tâm trạng

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet để sử dụng API
- Microphone (cho tính năng tin nhắn thoại)

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
