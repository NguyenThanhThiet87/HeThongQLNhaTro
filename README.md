# Hệ Thống Quản Lý Nhà Trọ

[![.NET](https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Cloud](https://img.shields.io/badge/Deploy-Google%20Cloud-4285F4?logo=googlecloud&logoColor=white)](https://cloud.google.com/)

Hệ Thống Quản Lý Nhà Trọ là ứng dụng di động phục vụ quản lý vận hành nhà trọ. Hệ thống hỗ trợ ba nhóm người dùng: chủ nhà trọ, người thuê và nhà cung cấp dịch vụ; bao phủ các nghiệp vụ phòng trọ, hợp đồng, điện nước, hóa đơn, bảo trì, thông báo và thanh toán.

> Dự án học tập. Cấu hình nhạy cảm chỉ được lấy từ biến môi trường hoặc Secret Manager; không đưa khóa, mật khẩu hay database dump vào Git.

**Tác giả:** Nguyễn Thanh Thiệt<br>
**Mục đích:** Học tập và thực hành kiến trúc microservices, triển khai cloud và CI/CD

## Mục lục

- [Nghiệp vụ và phạm vi](#nghiệp-vụ-và-phạm-vi)
- [Tính năng](#tính-năng)
- [Kiến trúc kỹ thuật](#kiến-trúc-kỹ-thuật)
- [Công nghệ](#công-nghệ)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Chạy local](#chạy-local)
- [Cấu hình](#cấu-hình)
- [Kiểm thử API](#kiểm-thử-api)
- [Triển khai GCP và CI/CD](#triển-khai-gcp-và-cicd)
- [Bảo mật và vận hành](#bảo-mật-và-vận-hành)
- [Các việc cần hoàn thiện](#các-việc-cần-hoàn-thiện)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Nghiệp vụ và phạm vi

```text
Chủ nhà trọ
  → quản lý dãy/phòng, loại phòng, thiết bị
  → lập hợp đồng, thành viên thuê, chỉ số điện nước
  → tạo hóa đơn, theo dõi doanh thu, xử lý sự cố

Người thuê
  → xem thông tin phòng, hợp đồng, hóa đơn
  → đặt dịch vụ, thanh toán, báo cáo sự cố, nhận thông báo

Nhà cung cấp
  → quản lý dịch vụ/sản phẩm, đơn hàng và doanh thu
```

## Tính năng

### Xác thực và tài khoản

- Đăng ký, đăng nhập, refresh token và JWT.
- OTP cho các luồng xác minh/khôi phục tài khoản.
- Hồ sơ người dùng, đổi mật khẩu và số điện thoại.
- Phân quyền theo vai trò người dùng.

### Quản lý vận hành nhà trọ

- Dãy nhà trọ, phòng, loại phòng, hình ảnh và thiết bị.
- Hợp đồng thuê, thành viên hợp đồng, thông tin tạm trú.
- Dịch vụ, chỉ số điện nước, hóa đơn và lịch sử thanh toán.
- Báo cáo sự cố, nhà cung cấp, chi tiết xử lý và lịch sử bảo trì.
- Thông báo và chat thời gian thực qua SignalR.

### Thanh toán và tích hợp ngoài

- Tạo/xử lý thanh toán VNPay và PayOS.
- Upload media qua Cloudinary.
- Xác thực Firebase trong các luồng đã tích hợp.

## Kiến trúc kỹ thuật

```text
React Native / Expo
        │ HTTP API
        ▼
Kong Gateway trên GKE
        │ định tuyến theo API path
        ▼
Cloud Run: 7 ASP.NET Core microservices
 ├── IdentityService
 ├── PropertyService
 ├── ContractService
 ├── UtilityService
 ├── BillingService
 ├── MaintenanceService
 └── CommunicationService
        │                    │
        ▼                    ▼
Cloud SQL PostgreSQL     RabbitMQ trên private VM
(mỗi service một DB)     (MassTransit event bus)
```

Kong là điểm vào API duy nhất. Các Cloud Run service được cấu hình ingress nội bộ và Kong chuyển tiếp request tới từng service. Ở môi trường GCP hiện tại, Kong được expose qua external IP của GKE LoadBalancer để kiểm thử; khi phát hành cần domain và HTTPS.

## Công nghệ

| Nhóm | Công nghệ |
| --- | --- |
| Mobile | React Native 0.81, Expo SDK 54, React Navigation, Axios |
| Backend | ASP.NET Core Web API, .NET 9, C# |
| Data | Entity Framework Core 9, PostgreSQL 15, Cloud SQL |
| Gateway | Kong Gateway ở chế độ DB-less |
| Messaging | MassTransit, RabbitMQ |
| Realtime | SignalR |
| Cloud | Cloud Run, GKE Autopilot, Artifact Registry, Secret Manager, Cloud SQL, Compute Engine |
| CI/CD | GitHub Actions |
| External services | Cloudinary, Firebase, VNPay, PayOS |

## Cấu trúc dự án

```text
.
├── Frontend/                         # Expo / React Native application
│   ├── src/
│   │   ├── api/                      # HTTP clients và API modules
│   │   ├── components/               # UI dùng chung
│   │   ├── context/                  # Auth state
│   │   ├── hooks/                    # Logic tái sử dụng
│   │   ├── navigation/               # Navigation theo vai trò
│   │   ├── screens/                  # Màn hình nghiệp vụ
│   │   └── services/                 # Firebase, SignalR, domain services
│   ├── App.js
│   └── package.json
├── Backend/
│   └── Microservices/
│       ├── IdentityService/
│       ├── PropertyService/
│       ├── ContractService/
│       ├── UtilityService/
│       ├── BillingService/
│       ├── MaintenanceService/
│       ├── CommunicationService/
│       ├── Shared.Integration/       # gRPC proto và integration contracts
│       ├── kong/                     # Kong config cho GCP/GKE
│       ├── kong.yml                  # Kong config local
│       ├── docker-compose.yml        # PostgreSQL, RabbitMQ, Kong local
│       ├── HeThongQLNhaTroMicroservices.sln
│       └── tests/api/                # Read-only smoke tests
└── .github/workflows/deploy-gcp.yml  # Build và deploy backend lên GCP
```

## Yêu cầu môi trường

### Phát triển local

- Node.js LTS và npm.
- Expo Go trên thiết bị Android/iOS hoặc Android Emulator.
- .NET SDK 9.0.
- Docker Desktop.
- PostgreSQL và RabbitMQ được khởi động từ Docker Compose.

### Triển khai cloud

- GCP project có Cloud Run, Cloud SQL Admin, Artifact Registry, Secret Manager, Compute Engine, GKE và Serverless VPC Access.
- GitHub repository variables/secrets cho workflow triển khai.
- Tài khoản Cloudinary, Firebase, VNPay và/hoặc PayOS nếu sử dụng luồng tương ứng.

## Chạy local

### 1. Khởi động backend và hạ tầng

```powershell
cd Backend\Microservices

# Khôi phục và build solution
dotnet restore .\HeThongQLNhaTroMicroservices.sln
dotnet build .\HeThongQLNhaTroMicroservices.sln --configuration Release

# Khởi động hạ tầng local cần thiết
docker compose up -d postgres-db rabbitmq kong

# Mở 7 service ở các terminal riêng
.\run_all.ps1
```

Kong local lắng nghe tại `http://localhost:8000`; các service chạy lần lượt ở cổng `5001` đến `5007`. Khi gọi từ frontend local, đi qua Kong thay vì gọi thẳng từng service.

```text
POST http://localhost:8000/api/NguoiDung/login
```

> `docker-compose.yml` vẫn có Kafka/Zookeeper cho mục đích tương thích/thử nghiệm cũ. Luồng tích hợp hiện tại sử dụng RabbitMQ qua MassTransit; không cần khởi động Kafka cho luồng API thông thường.

### 2. Khởi động ứng dụng mobile

```powershell
cd Frontend
npm ci
npx expo start
```

Quét QR bằng Expo Go hoặc nhấn `a` trong terminal để chạy Android emulator. Dùng `j` để mở React Native DevTools.

## Cấu hình

### Backend

Không commit `appsettings.Development.json`, connection string, service-account key hay database backup. Với .NET, cấu hình lồng nhau dùng dấu `__`:

```text
ConnectionStrings__DefaultConnection
Jwt__Key
Jwt__Issuer
Jwt__Audience
RabbitMq__Host
RabbitMq__Username
RabbitMq__Password
RabbitMq__VirtualHost
Cloudinary__CloudName
Cloudinary__ApiKey
Cloudinary__ApiSecret
Vnpay__HashSecret
PayOS__ApiKey
```

Cloud Run nhận những giá trị này từ Secret Manager. Chuỗi kết nối Cloud SQL của Npgsql dùng Unix socket:

```text
Host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME;Database=identity_db;Username=APP_USER;Password=APP_PASSWORD
```

Mỗi service dùng database riêng: `identity_db`, `property_db`, `contract_db`, `utility_db`, `billing_db`, `maintenance_db` và `communication_db`.

### Frontend

Ứng dụng phải gọi Kong qua một base URL, không dùng `localhost` khi chạy trên thiết bị thật. Ví dụ môi trường phát triển:

```text
EXPO_PUBLIC_API_BASE_URL=http://<KONG_EXTERNAL_IP>
```

> Rà soát hiện tại cho thấy nhiều file trong `Frontend/src` vẫn hard-code URL ngrok cũ. Cần gom chúng về một HTTP client/config dùng `EXPO_PUBLIC_API_BASE_URL` trước khi tích hợp chính thức với GCP; URL ngrok cũ không phải endpoint triển khai ổn định.

## Kiểm thử API

Sau khi các service local đã chạy, sử dụng smoke test chỉ đọc:

```powershell
cd Backend\Microservices
.\tests\api\run-readonly-smoke.ps1 -Token '<JWT nếu endpoint yêu cầu>'
```

Script chỉ gửi request `GET`; HTTP 5xx được xem là lỗi. Không dùng POST/PUT/DELETE với dữ liệu hoặc tài khoản production để test thanh toán, hợp đồng hay thông báo.

OpenAPI local của từng service có thể import vào Postman:

| Service | Port | OpenAPI |
| --- | ---: | --- |
| IdentityService | 5001 | `http://localhost:5001/openapi/v1.json` |
| PropertyService | 5002 | `http://localhost:5002/openapi/v1.json` |
| ContractService | 5003 | `http://localhost:5003/openapi/v1.json` |
| UtilityService | 5004 | `http://localhost:5004/openapi/v1.json` |
| BillingService | 5005 | `http://localhost:5005/openapi/v1.json` |
| MaintenanceService | 5006 | `http://localhost:5006/openapi/v1.json` |
| CommunicationService | 5007 | `http://localhost:5007/openapi/v1.json` |

## Triển khai GCP và CI/CD

Workflow [deploy-gcp.yml](.github/workflows/deploy-gcp.yml) chạy khi có thay đổi trong `Backend/**` hoặc chính file workflow trên nhánh `main`:

1. Restore và build solution .NET 9.
2. Xác thực GCP bằng service-account JSON lưu trong GitHub Secret `GCP_SA_KEY`.
3. Build image cho từng service và push lên Artifact Registry.
4. Deploy 7 Cloud Run services, gắn Cloud SQL Unix socket, VPC Connector và Secret Manager.

Các GitHub Variables không nhạy cảm cần có:

```text
GCP_PROJECT_ID
GCP_REGION
GCP_RUNTIME_SERVICE_ACCOUNT
CLOUD_SQL_INSTANCE
VPC_CONNECTOR
```

Chi tiết hạ tầng backend nằm tại [Backend/Microservices/DEPLOYMENT-GCP.md](Backend/Microservices/DEPLOYMENT-GCP.md).

> Workflow hiện chỉ triển khai backend. Mobile app cần pipeline EAS Build/Submit riêng khi phát hành Android/iOS.

## Bảo mật và vận hành

- Dùng Secret Manager cho database, JWT, RabbitMQ và khóa bên thứ ba.
- Gán quyền tối thiểu cho Cloud Run runtime account và GitHub deployer account.
- Cloud SQL chỉ truy cập qua Cloud SQL connector/Unix socket hoặc private IP; không whitelist public IP động của Cloud Run.
- RabbitMQ chạy trong private network; không mở management UI hoặc AMQP ra Internet.
- Giới hạn ingress Cloud Run ở nội bộ và chỉ expose Kong gateway.
- Rotate ngay service-account key, Firebase key hoặc token đã từng xuất hiện trong commit, log hay ảnh chụp.
- Thiết lập Cloud Monitoring alerts cho HTTP 5xx, Cloud SQL connections, CPU/memory Cloud Run và RabbitMQ queue depth.
- Khi phát hành, dùng domain + HTTPS, đặt external Application Load Balancer/Cloud Armor trước Kong và cấu hình CORS theo domain frontend thật.

## Các việc cần hoàn thiện

- Chuẩn hóa toàn bộ API client React Native qua một `EXPO_PUBLIC_API_BASE_URL`; loại bỏ URL ngrok hard-code.
- Cấu hình HTTPS/domain trước khi phát hành ứng dụng thật, nhất là luồng đăng nhập và thanh toán.
- Chạy EF migrations như release job có backup Cloud SQL, không chạy ở startup của mọi instance.
- Bổ sung Redis backplane cho SignalR trước khi scale service realtime thành nhiều instance.
- Rà soát hoặc loại bỏ Kafka dependencies còn lại nếu RabbitMQ là transport thống nhất.
- Xóa monolith legacy `Backend/ServerQLNhaTro` sau khi xác nhận không còn cần rollback/tham khảo, đồng thời thu hồi Firebase credential cũ.

## Đóng góp

1. Tạo branch từ `main`.
2. Không commit secret, `.env`, service-account JSON, database dump, `node_modules/`, `bin/` hoặc `obj/`.
3. Chạy `dotnet build` với backend và kiểm tra Expo app trước khi mở pull request.
4. Mô tả rõ thay đổi API, database migration, message contract và biến môi trường mới.

## Giấy phép

© 2026 Nguyễn Thanh Thiệt. Dự án được phát triển cho mục đích học tập. **All rights reserved**; không tái sử dụng, phân phối hoặc triển khai thương mại nếu chưa có sự đồng ý của tác giả.
