# GCP deployment

## Architecture

- Cloud Run: one service per API.
- Cloud SQL for PostgreSQL: one database per service.
- Artifact Registry: container images.
- Secret Manager: database connection strings, JWT and third-party keys.
- RabbitMQ: managed RabbitMQ or a private GKE deployment; do not run it in Cloud Run.

## One-time setup

1. Create an Artifact Registry Docker repository named `microservices` in the chosen region.
2. Create Cloud SQL and the seven databases. Give the Cloud Run runtime service account `roles/cloudsql.client`.
3. Create Secret Manager secrets, including `identity-db-connection`, `property-db-connection`, and the remaining service connection strings. Grant the runtime account `roles/secretmanager.secretAccessor`.
4. Create a least-privilege deployer service account and download its JSON key. Store the full JSON exclusively as the GitHub Actions secret `GCP_SA_KEY`; never add the file to this repository.
5. Create GitHub variables `GCP_PROJECT_ID`, `GCP_REGION`, and `GCP_RUNTIME_SERVICE_ACCOUNT`.

## Required application configuration

Use Cloud Run environment variables or Secret Manager mappings. A Cloud SQL Unix socket Npgsql connection string uses this form:

`Host=/cloudsql/PROJECT:REGION:INSTANCE;Database=identity_db;Username=app_user;Password=...`

Set `RabbitMq__Host`, `RabbitMq__Username`, and `RabbitMq__Password` to the private broker endpoint and credentials. Set cross-service gRPC URLs through `Services__IdentityGrpcUrl`, `Services__PropertyGrpcUrl`, `Services__ContractGrpcUrl`, and `Services__UtilityGrpcUrl`.

## Before enabling production traffic

- Run EF migrations as a controlled release job, after a Cloud SQL backup; never from every Cloud Run instance startup.
- Configure a SignalR Redis backplane before allowing more than one Cloud Run instance for services using SignalR.
- Put a load balancer/API gateway in front of public APIs; keep service ingress internal.
- Configure Cloud Monitoring alerts for HTTP 5xx, Cloud SQL connections, and RabbitMQ queue depth.
