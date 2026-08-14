# Danh sách Microservices và API Endpoints

Dưới đây là danh sách các Microservices trong hệ thống `HeThongQLNhaTro`, kèm theo cổng chạy mặc định (HTTP) và đường dẫn truy vấn mô tả API (OpenAPI/Swagger JSON). 

Bạn có thể copy các đường dẫn **OpenAPI JSON URL** bên dưới và dán vào chức năng **Import của Postman** để tự động tạo toàn bộ Collection test API cho từng service.

| STT | Tên Microservice | Cổng (HTTP) | OpenAPI JSON URL (Dùng để Import vào Postman) |
|---|---|---|---|
| 1 | **IdentityService** | `5001` | `http://localhost:5001/openapi/v1.json` |
| 2 | **PropertyService** | `5002` | `http://localhost:5002/openapi/v1.json` |
| 3 | **ContractService** | `5003` | `http://localhost:5003/openapi/v1.json` |
| 4 | **UtilityService** | `5004` | `http://localhost:5004/openapi/v1.json` |
| 5 | **BillingService** | `5005` | `http://localhost:5005/openapi/v1.json` |
| 6 | **MaintenanceService** | `5006` | `http://localhost:5006/openapi/v1.json` |
| 7 | **CommunicationService** | `5007` | `http://localhost:5007/openapi/v1.json` |

---

### Hướng dẫn cách test nhanh API bằng Postman:
1. Mở ứng dụng Postman.
2. Bấm nút **Import** ở góc trên bên trái.
3. Dán một đường link ở cột **OpenAPI JSON URL** (ví dụ của IdentityService: `http://localhost:5001/openapi/v1.json`) vào ô tìm kiếm.
4. Bấm Import. Postman sẽ tự động sinh ra một thư mục chứa tất cả các APIs có sẵn để bạn test ngay lập tức.
