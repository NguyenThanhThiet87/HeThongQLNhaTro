<##
Runs safe, read-only API smoke tests. It never sends POST, PUT, PATCH, or DELETE.
Set an access token only when an endpoint requires it.
Example: .\run-readonly-smoke.ps1 -Token '<jwt>'
##>
[CmdletBinding()]
param(
    [string]$Token = '',
    [switch]$SkipTlsValidation
)

if ($SkipTlsValidation) {
    [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
}

$headers = @{ Accept = 'application/json' }
if ($Token) { $headers.Authorization = "Bearer $Token" }

# Replace IDs with records that exist in the target environment. 401/403/404 are
# reported as configuration/data prerequisites; 5xx always fails the test.
$requests = @(
    @{ Name = 'Identity - user lookup'; Url = 'http://localhost:5001/api/NguoiDung/nguoi-dung?maNd=1' },
    @{ Name = 'Property - buildings'; Url = 'http://localhost:5002/api/PhongNhaTro/day-nha-tros?maChuNt=1' },
    @{ Name = 'Property - rooms'; Url = 'http://localhost:5002/api/PhongNhaTro/phongs?maDayNt=1' },
    @{ Name = 'Contract - contracts'; Url = 'http://localhost:5003/api/HopDong/HopDongs?maDayNt=1' },
    @{ Name = 'Utility - provider services'; Url = 'http://localhost:5004/api/DichVu/ncc/1' },
    @{ Name = 'Billing - invoices'; Url = 'http://localhost:5005/api/HoaDonThanhToan/hoa-dons?maDayNt=1&month=1&year=2026' },
    @{ Name = 'Maintenance - devices'; Url = 'http://localhost:5006/api/SuCoBaoTri/thiet-bi' },
    @{ Name = 'Maintenance - maintenance history'; Url = 'http://localhost:5006/api/SuCoBaoTri/lich-su-bao-tri?maPhong=1' },
    @{ Name = 'Communication - notifications'; Url = 'http://localhost:5007/api/ThongBao/danh-sach/1' }
)

$failed = @()
foreach ($request in $requests) {
    try {
        $response = Invoke-WebRequest -Uri $request.Url -Headers $headers -Method Get -UseBasicParsing
        $status = [int]$response.StatusCode
        if ($status -ge 500) {
            $failed += "$($request.Name): HTTP $status"
            Write-Host "FAIL  $($request.Name): HTTP $status" -ForegroundColor Red
        } elseif ($status -in 401, 403, 404) {
            Write-Host "SKIP  $($request.Name): HTTP $status (set token or seed test IDs)" -ForegroundColor Yellow
        } else {
            Write-Host "PASS  $($request.Name): HTTP $status" -ForegroundColor Green
        }
    } catch {
        $httpResponse = $_.Exception.Response
        if ($null -ne $httpResponse) {
            $status = [int]$httpResponse.StatusCode
            if ($status -in 401, 403, 404) {
                Write-Host "SKIP  $($request.Name): HTTP $status (set token or seed test IDs)" -ForegroundColor Yellow
            } else {
                $failed += "$($request.Name): HTTP $status"
                Write-Host "FAIL  $($request.Name): HTTP $status" -ForegroundColor Red
            }
        } else {
            $failed += "$($request.Name): $($_.Exception.Message)"
            Write-Host "FAIL  $($request.Name): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

if ($failed.Count) {
    Write-Error ("Smoke test failed:`n" + ($failed -join "`n"))
    exit 1
}
