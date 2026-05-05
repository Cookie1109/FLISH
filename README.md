# FLISH - Flashcard English Learning App

FLISH là một ứng dụng web học từ vựng tiếng Anh theo phương pháp Flashcard hiện đại, giúp người dùng ghi nhớ từ vựng hiệu quả qua các chủ đề, hình ảnh và bài tập Quiz tương tác.

## 🚀 Tính năng chính

- **Quản lý chủ đề**: Tạo và quản lý các nhóm từ vựng theo chủ đề riêng biệt.
- **Hệ thống Flashcard**: Lật thẻ để xem nghĩa, phát âm (Audio) và ví dụ minh họa.
- **Tự động tìm kiếm**: Tự động lấy định nghĩa, phát âm và hình ảnh từ API (Unsplash, Dictionary API).
- **Học thông minh**: Theo dõi tiến độ học tập (Chưa thuộc, Đang học, Đã thuộc).
- **Quiz**: Kiểm tra kiến thức với chế độ làm bài tập trắc nghiệm/tự luận.
- **Dashboard**: Bảng điều khiển trực quan theo dõi tiến trình và gợi ý từ cần ôn tập ngay.

## 🛠 Công nghệ sử dụng

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (với Sequelize ORM)
- **Frontend**: Handlebars (HBS), Tailwind CSS, Lucide Icons
- **Authentication**: Firebase Authentication
- **APIs**: Unsplash API, Free Dictionary API, MyMemory Translation API

## 📋 Yêu cầu hệ thống

- Node.js (v14 trở lên)
- npm hoặc yarn
- PostgreSQL database

## ⚙️ Cài đặt

1. **Clone dự án:**
   ```bash
   git clone <url-cua-du-an>
   cd FLISH
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình môi trường:**
   Tạo file `.env` tại thư mục gốc và cấu hình các biến sau (tham khảo file `.env.example` nếu có):
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=flishDB
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # Firebase configuration
   FIREBASE_PROJECT_ID=...
   FIREBASE_API_KEY=...
   # ... (các biến Firebase khác)
   ```

4. **Khởi tạo Database:**
   ```bash
   # Chạy migration để tạo bảng
   npm run db:migrate
   
   # (Tùy chọn) Chạy seed để có dữ liệu mẫu
   npm run db:seed
   ```

## 🏃‍♂️ Chạy ứng dụng

- **Chế độ phát triển (Development):**
  ```bash
  npm run dev
  ```
  Ứng dụng sẽ chạy tại: `http://localhost:3000`

- **Chế độ production:**
  ```bash
  npm start
  ```

## 📂 Cấu trúc thư mục

- `src/controllers`: Xử lý logic nghiệp vụ.
- `src/models`: Định nghĩa cấu trúc database (Sequelize).
- `src/routes`: Định nghĩa các API endpoints và điều hướng.
- `src/views`: Giao diện Handlebars (Layouts, Pages, Partials).
- `public/`: Chứa các file tĩnh (CSS, JS, Images).

## 📄 Giấy phép

Dự án này được phát triển cho mục đích học tập.
