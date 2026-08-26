# Hướng dẫn Triển khai Hệ Thống Microservices lên Render & Neon

Tài liệu này hướng dẫn cách kết nối hệ thống 7 Microservices .NET 9 và Kong API Gateway với **Neon PostgreSQL** và triển khai lên **Render.com**.

---

## 1. Thông tin Chuỗi Kết Nối Neon PostgreSQL

Chuỗi kết nối cho 7 microservices (dùng định dạng Npgsql .NET):

```text
# IdentityService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=identity_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# PropertyService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=property_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# ContractService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=contract_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# UtilityService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=utility_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# BillingService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=billing_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# MaintenanceService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=maintenance_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;

# CommunicationService
Host=ep-gentle-resonance-azrcsgzl-pooler.c-3.ap-southeast-1.aws.neon.tech;Port=5432;Database=communication_db;Username=neondb_owner;Password=npg_QWhw0og8$mLDS;SslMode=Require;Trust Server Certificate=true;
```

---

## 2. Chuẩn bị Message Broker (CloudAMQP - Miễn phí)

1. Đăng ký tài khoản tại [CloudAMQP](https://www.cloudamqp.com/).
2. Tạo 1 instance mới:
   - **Plan:** `Little Lemur (Free)`
   - **Region:** `Amazon Web Services - Singapore (ap-southeast-1)`
3. Vào trang chi tiết Instance, bạn sẽ thấy:
   - **Server / Host:** ví dụ `hound.rmq.cloudamqp.com`
   - **User & VHost:** ví dụ `xxxxxx`
   - **Password:** ví dụ `xxxxxx`

---

## 3. Triển khai lên Render bằng Blueprint (render.yaml)

1. Đăng nhập vào [Render.com](https://render.com).
2. Chọn **Blueprints** ở thanh menu trên $\rightarrow$ Chọn **New Blueprint Instance**.
3. Kết nối repository GitHub: `NguyenThanhThiet87/HeThongQLNhaTro`.
4. Render sẽ tự động đọc file `render.yaml` ở thư mục gốc và liệt kê danh sách 8 services:
   - `kong-gateway` (Web Service - Public)
   - 7 Microservices (Private Services - Internal Network)
5. Render sẽ yêu cầu bạn nhập các biến môi trường được đánh dấu `sync: false`:
   - `ConnectionStrings__DefaultConnection`: Dán chuỗi kết nối Neon tương ứng của từng service (ở mục 1).
   - `RabbitMq__Host`: Host của CloudAMQP.
   - `RabbitMq__Username`: User của CloudAMQP.
   - `RabbitMq__Password`: Password của CloudAMQP.
   - `RabbitMq__VirtualHost`: VHost của CloudAMQP.
   - `Jwt__Key`: Chuỗi bí mật JWT (tối thiểu 32 ký tự).
   - `CloudinarySettings__...`: Thông tin Cloudinary của bạn.
6. Bấm **Apply**. Render sẽ tự động build các image Docker và khởi chạy toàn bộ hệ thống.

---

## 4. Kết nối Frontend (React Native / Expo)

1. Sau khi Render triển khai xong `kong-gateway`, bạn sẽ nhận được một URL công khai:
   `https://kong-gateway-xxxx.onrender.com`
2. Cập nhật biến môi trường trên Mobile App (`Frontend/.env`):
   ```text
   EXPO_PUBLIC_API_BASE_URL=https://kong-gateway-xxxx.onrender.com
   ```
3. Chạy `npx expo start` để bắt đầu trải nghiệm!
