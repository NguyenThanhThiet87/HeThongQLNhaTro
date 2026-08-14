# API verification

Run the non-destructive smoke suite after starting the services and their PostgreSQL/RabbitMQ dependencies:

```powershell
.\run-readonly-smoke.ps1 -Token '<JWT-if-required>'
```

The suite deliberately performs only `GET` requests and treats HTTP 5xx as failures. `401`, `403`, and `404` identify missing test credentials or seed IDs, not a destructive retry condition.

For write/payment endpoints, use isolated test databases and test accounts. Do not run POST/PUT/DELETE payment or contract requests against production because they create contracts, invoices, orders, notifications, or external payment links.
