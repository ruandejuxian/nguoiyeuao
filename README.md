# Người Yêu Ảo - Hướng dẫn triển khai và sử dụng

## Giới thiệu

Người Yêu Ảo là một ứng dụng web cho phép người dùng tạo và tương tác với một người yêu ảo thông qua trí tuệ nhân tạo. Ứng dụng sử dụng HTML, CSS và JavaScript thuần, không yêu cầu backend phức tạp, và tích hợp với Gemini API để tạo phản hồi hội thoại tự nhiên.

## Yêu cầu hệ thống

- Trình duyệt web hiện đại (Chrome, Firefox, Edge, Safari)
- Kết nối internet
- API key của Google Gemini
- Tài khoản Google (tùy chọn, để sao lưu/khôi phục dữ liệu)

## Triển khai ứng dụng

Có hai cách để triển khai ứng dụng:

### Cách 1: Triển khai trên máy chủ web tĩnh

1. Tải toàn bộ thư mục `virtual-companion` lên máy chủ web của bạn
2. Đảm bảo cấu trúc thư mục được giữ nguyên
3. Truy cập trang web thông qua URL của máy chủ

### Cách 2: Triển khai trên GitHub Pages

1. Tạo một repository trên GitHub
2. Tải toàn bộ thư mục `virtual-companion` lên repository
3. Bật tính năng GitHub Pages trong phần Settings của repository
4. Chọn branch main và thư mục root làm nguồn
5. Truy cập trang web thông qua URL được cung cấp (thường có dạng `username.github.io/repository-name`)

### Cách 3: Triển khai trên Netlify

1. Tạo tài khoản trên Netlify (https://www.netlify.com/)
2. Tạo một repository trên GitHub và tải toàn bộ thư mục `virtual-companion` lên
3. Trong Netlify, chọn "New site from Git" và kết nối với repository GitHub của bạn
4. Không cần cấu hình thêm, nhấn "Deploy site"
5. Truy cập trang web thông qua URL được cung cấp bởi Netlify

## Cấu hình ứng dụng

### Cấu hình API Gemini

1. Truy cập https://makersuite.google.com/app/apikey để tạo API key cho Gemini
2. Trong ứng dụng, chuyển đến tab "Cài Đặt"
3. Nhập API key vào ô "API Key" và nhấn "Lưu API Key"
4. Trạng thái kết nối sẽ chuyển từ "Chưa kết nối API" sang "Đã kết nối API"

### Cấu hình Google API (tùy chọn, cho tính năng sao lưu)

Để sử dụng tính năng sao lưu và khôi phục dữ liệu với Google Drive, bạn cần cấu hình Google API:

1. Truy cập https://console.cloud.google.com/ và tạo một dự án mới
2. Bật Google Drive API và Google Sheets API
3. Tạo OAuth 2.0 Client ID và API Key
4. Mở file `js/config.js` và cập nhật các giá trị sau:
   ```javascript
   GOOGLE_API: {
       CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Thay bằng Client ID của bạn
       API_KEY: 'YOUR_GOOGLE_API_KEY', // Thay bằng API Key của bạn
       ...
   }
   ```

## Hướng dẫn sử dụng

### Tạo nhân vật

1. Khi mới truy cập ứng dụng, bạn sẽ thấy màn hình chào mừng
2. Nhấn "Tạo Nhân Vật Ngay" hoặc chuyển đến tab "Tạo Nhân Vật"
3. Điền thông tin nhân vật:
   - Tên: Tên của nhân vật
   - Giới tính: Nam hoặc Nữ
   - Tuổi: Tuổi của nhân vật (18-35)
   - Tính cách: Mô tả tính cách (vd: vui tính, dịu dàng, tsundere)
   - Sở thích: Mô tả sở thích (vd: K-pop, phim, game)
   - Chọn avatar: Chọn một trong các avatar có sẵn
4. Nhấn "Tạo Nhân Vật" để hoàn tất

### Chat với nhân vật

1. Sau khi tạo nhân vật, bạn sẽ được chuyển đến tab "Chat"
2. Nhập tin nhắn vào ô nhập liệu ở dưới cùng và nhấn nút gửi hoặc Enter
3. Nhân vật sẽ phản hồi dựa trên tính cách và sở thích đã được cài đặt
4. Mức độ thân thiết sẽ tăng dần khi bạn trò chuyện nhiều hơn
5. Avatar của nhân vật sẽ thay đổi biểu cảm dựa trên nội dung tin nhắn

### Nhật ký tình yêu

1. Chuyển đến tab "Nhật Ký" để xem các khoảnh khắc đặc biệt
2. Các khoảnh khắc đặc biệt sẽ tự động được ghi lại, như:
   - Lần đầu gặp gỡ
   - Lần đầu nói lời yêu thương
   - Khi mức độ thân thiết đạt mức "Người yêu"
   - Các khoảnh khắc đặc biệt khác trong cuộc trò chuyện

### Mini Game

1. Chuyển đến tab "Mini Game" để chơi các trò chơi với nhân vật
2. Có hai trò chơi:
   - Đoán Sở Thích: Đoán xem nhân vật thích gì
   - Trò Chơi Trí Nhớ: Kiểm tra trí nhớ của bạn về nhân vật
3. Trả lời đúng sẽ tăng mức độ thân thiết với nhân vật

### Cài đặt

1. Chuyển đến tab "Cài Đặt" để quản lý cấu hình và dữ liệu
2. Các tùy chọn:
   - API Gemini: Cấu hình API key
   - Đồng Bộ Dữ Liệu: Sao lưu và khôi phục dữ liệu với Google Drive
   - Quản lý dữ liệu: Xóa lịch sử chat, nhân vật hoặc tất cả dữ liệu

## Các tính năng chính

### Hệ thống mức độ thân thiết

- Mức độ thân thiết tăng khi:
  - Gửi tin nhắn (+1 điểm/tin nhắn)
  - Sử dụng từ khóa yêu thương như "yêu", "thích", "nhớ" (+3-5 điểm)
  - Trả lời đúng trong mini game (+5 điểm)
- Các cấp độ thân thiết:
  - Mới quen (0-29 điểm)
  - Bạn bè (30-59 điểm)
  - Thân thiết (60-99 điểm)
  - Người yêu (100-149 điểm)
  - Tri kỷ (150+ điểm)
- Mức độ thân thiết ảnh hưởng đến cách nhân vật trả lời

### Avatar động

- Avatar sẽ thay đổi biểu cảm dựa trên nội dung tin nhắn
- Các biểu cảm: vui, buồn, giận, ngạc nhiên, yêu thương, trung tính
- Biểu cảm được phát hiện tự động từ nội dung tin nhắn

### Lưu trữ dữ liệu

- Dữ liệu được lưu tự động vào localStorage của trình duyệt
- Tùy chọn sao lưu và khôi phục dữ liệu với Google Drive
- Dữ liệu được lưu trữ bao gồm:
  - Thông tin nhân vật
  - Lịch sử chat
  - Nhật ký tình yêu
  - Mức độ thân thiết

## Xử lý sự cố

### API Gemini không hoạt động

- Kiểm tra API key đã được nhập chính xác
- Đảm bảo API key còn hiệu lực và có đủ quota
- Kiểm tra kết nối internet

### Dữ liệu bị mất

- Nếu đã sao lưu với Google Drive, sử dụng tính năng khôi phục dữ liệu
- Nếu không, dữ liệu có thể bị mất khi xóa cache trình duyệt hoặc sử dụng chế độ ẩn danh

### Tính năng Google Drive không hoạt động

- Kiểm tra cấu hình CLIENT_ID và API_KEY trong file config.js
- Đảm bảo đã bật Google Drive API và Google Sheets API trong Google Cloud Console
- Kiểm tra quyền truy cập và phạm vi đã được cấu hình đúng

## Tùy chỉnh và mở rộng

### Thay đổi giao diện

- Chỉnh sửa file `css/style.css` để thay đổi màu sắc, font chữ và bố cục
- Các biến CSS chính:
  ```css
  :root {
      --primary-color: #ff6b6b;
      --primary-dark: #ff5252;
      --secondary-color: #4ecdc4;
      --accent-color: #ffe66d;
      ...
  }
  ```

### Thêm avatar mới

1. Thêm hình ảnh avatar vào thư mục `assets/images`
2. Cập nhật HTML trong file `index.html` để thêm tùy chọn avatar mới:
   ```html
   <div class="avatar-option" data-avatar="ten-file-avatar.png">
       <img src="assets/images/ten-file-avatar.png" alt="Avatar mới">
   </div>
   ```

### Thêm mini game mới

1. Thêm HTML cho game mới trong tab "Mini Game" trong file `index.html`
2. Thêm logic xử lý game trong file `js/game.js`
3. Cập nhật hàm `Game.init()` để khởi tạo game mới

## Liên hệ và hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ qua email hoặc tạo issue trên GitHub repository.

---

Chúc bạn có trải nghiệm vui vẻ với Người Yêu Ảo!
