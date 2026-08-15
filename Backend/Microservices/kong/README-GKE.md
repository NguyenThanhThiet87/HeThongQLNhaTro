# Kong Gateway on GKE Autopilot

This directory is the production counterpart of the local `../kong.yml`.
It keeps Kong in DB-less mode, with the desired gateway state stored in Git.

## Initial installation (Cloud Shell)

```bash
gcloud container clusters get-credentials kong-gateway --region asia-southeast1 --project qlnhatro-505506
kubectl create namespace kong
kubectl create configmap kong-gcp-config --namespace kong --from-file=kong.yml=Backend/Microservices/kong/kong.gcp.yml
helm repo add kong https://charts.konghq.com
helm repo update
helm upgrade --install kong kong/kong --namespace kong --values Backend/Microservices/kong/values.gcp.yaml --wait
kubectl get pods,services --namespace kong
```

## Configuration rollout

When `kong.gcp.yml` changes, apply the new ConfigMap and restart Kong:

```bash
kubectl create configmap kong-gcp-config --namespace kong --from-file=kong.yml=Backend/Microservices/kong/kong.gcp.yml --dry-run=client -o yaml | kubectl apply -f -
kubectl rollout restart deployment/kong-kong --namespace kong
kubectl rollout status deployment/kong-kong --namespace kong
```

## Security prerequisites

Before sending traffic through Kong, make the Cloud Run services reachable from
the project VPC and configure invocation authentication consistently. Do not
expose Kong's Admin API or the Cloud Run default URLs to the public internet.

The CORS origin in `kong.gcp.yml` is deliberately a placeholder. Replace it
with the actual HTTPS frontend domain before applying this configuration.
