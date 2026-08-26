#!/bin/sh
set -e

# Default fallback URLs if not specified
export IDENTITY_SERVICE_URL=${IDENTITY_SERVICE_URL:-http://identity-service:8080}
export PROPERTY_SERVICE_URL=${PROPERTY_SERVICE_URL:-http://property-service:8080}
export CONTRACT_SERVICE_URL=${CONTRACT_SERVICE_URL:-http://contract-service:8080}
export UTILITY_SERVICE_URL=${UTILITY_SERVICE_URL:-http://utility-service:8080}
export BILLING_SERVICE_URL=${BILLING_SERVICE_URL:-http://billing-service:8080}
export MAINTENANCE_SERVICE_URL=${MAINTENANCE_SERVICE_URL:-http://maintenance-service:8080}
export COMMUNICATION_SERVICE_URL=${COMMUNICATION_SERVICE_URL:-http://communication-service:8080}

echo "Resolving Kong Gateway backend endpoints..."
echo "IDENTITY_SERVICE_URL: $IDENTITY_SERVICE_URL"
echo "PROPERTY_SERVICE_URL: $PROPERTY_SERVICE_URL"
echo "CONTRACT_SERVICE_URL: $CONTRACT_SERVICE_URL"
echo "UTILITY_SERVICE_URL: $UTILITY_SERVICE_URL"
echo "BILLING_SERVICE_URL: $BILLING_SERVICE_URL"
echo "MAINTENANCE_SERVICE_URL: $MAINTENANCE_SERVICE_URL"
echo "COMMUNICATION_SERVICE_URL: $COMMUNICATION_SERVICE_URL"

envsubst < /kong/declarative/kong.render.template.yml > /kong/declarative/kong.yml

exec /docker-entrypoint.sh kong docker-start
