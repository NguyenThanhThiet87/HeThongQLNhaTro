# 🚀 Hướng Dẫn Khởi Chạy Hệ Thống Backend Microservices

Tài liệu này hướng dẫn cách khởi chạy toàn bộ hệ thống quản lý nhà trọ (phiên bản Microservices) một cách tuần tự, nhanh chóng và chuẩn xác nhất.

## 🛠 Yêu cầu hệ thống
- **Docker Desktop** (Đang chạy).
- **.NET SDK 9.0** (Đã cài đặt).
- OS: **Windows** (do sử dụng PowerShell script).

---

## Bước 1: Khởi động Hạ tầng (Infrastructure)

Hệ thống cần các dịch vụ nền tảng: **PostgreSQL** (Database), **RabbitMQ & Kafka** (Message Broker), **Kong** (API Gateway).

1. Mở **PowerShell**.
2. Di chuyển vào thư mục chứa Docker Compose:
   ```powershell
   cd d:\HeThongQLNhaTro\HeThongQLNhaTro\Backend\Microservices
   ```
3. Chạy lệnh khởi động hạ tầng (chạy ngầm):
   ```powershell
   docker-compose up -d
   ```
   > 💡 *Mẹo: Mở giao diện Docker Desktop để xác nhận các containers (kong, postgres, rabbitmq, kafka, zookeeper) chuyển sang trạng thái xanh (Running).*

---

## Bước 2: Khởi động 7 Microservices

Chúng ta sử dụng script tự động để mở 7 cửa sổ console cho 7 dịch vụ (Identity, Property, Contract, Utility, Billing, Maintenance, Communication).

1. Tại cửa sổ PowerShell đang mở ở thư mục `Microservices`, chạy lệnh:
   ```powershell
   .\run_all.ps1
   ```
2. Chờ khoảng 10-15 giây để 7 cửa sổ console tự động bung lên và hoàn tất quá trình build/run.

---

## Bước 3: Sử dụng và Tích hợp

Khi toàn bộ hạ tầng và Microservices đã chạy, bạn **KHÔNG** giao tiếp trực tiếp qua các port 5001, 5002... nữa, mà gọi tập trung qua **Kong API Gateway**.

- **Cổng giao tiếp duy nhất (Base URL):**
  `http://localhost:8000`

- **Ví dụ Endpoint truy cập:**
  - Lấy Token: `POST http://localhost:8000/api/Auth/login`
  - Quản lý Hợp Đồng: `GET http://localhost:8000/api/HopDong`
  - Quản lý Hóa Đơn: `GET http://localhost:8000/api/HoaDonThanhToan`

> **Lưu ý cho Frontend (React/Vue/Angular):** Hãy đổi biến môi trường (Environment Variable) kết nối API Backend của bạn thành `http://localhost:8000`.

---

## 🛑 Cách Tắt Hệ Thống

Khi không sử dụng nữa, hãy dọn dẹp để giải phóng RAM:
1. Đóng 7 cửa sổ console đang chạy Microservices bằng phím tắt `Ctrl + C` hoặc click dấu `X`.
2. Tắt các Docker containers bằng lệnh:
   ```powershell
   docker-compose down
   ```
