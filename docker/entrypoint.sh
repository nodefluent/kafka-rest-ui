#!/bin/bash

export REACT_APP_KAFKA_REST_URL="${REACT_APP_KAFKA_REST_URL:-http://localhost:8082}"
export REACT_APP_TIMEOUT="${REACT_APP_TIMEOUT:-2000}"
export PROXY_SKIP_VERIFY="${PROXY_SKIP_VERIFY:-false}"
export INSECURE_PROXY=
export PROXY_URL="${PROXY_URL}"
export HTTP_PORT=${HTTP_PORT:-8000}
export BASIC_AUTH_USER=${BASIC_AUTH_USER}
export BASIC_AUTH_PASSWORD=${BASIC_AUTH_PASSWORD}

if echo "$PROXY_SKIP_VERIFY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
    INSECURE_PROXY=insecure_skip_verify
fi

if [[ -z "$REACT_APP_KAFKA_REST_URL" ]]; then
    echo "Kafka REST URL was not set via REACT_APP_KAFKA_REST_URL environment variable."
fi

if [ ! -z "$BASIC_AUTH_USER" ]; then
  echo 'basicauth {$REACT_APP_KAFKA_REST_URL} {$BASIC_AUTH_USER} {$BASIC_AUTH_PASSWORD}' >>/caddy/Caddyfile
fi

if echo "$PROXY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
  PROXY_URL=${REACT_APP_KAFKA_REST_URL}
  REACT_APP_KAFKA_REST_URL="/api/kafka-rest"
  echo 'proxy /api/kafka-rest {$PROXY_URL} {
  without /api/kafka-rest
  {$INSECURE_PROXY}
}' >>/caddy/Caddyfile
fi

echo "Building application..."
NODE_ENV=production yarn build

echo
echo "Starting server..."
echo "http://0.0.0.0:${HTTP_PORT}"
cat /caddy/Caddyfile
exec /caddy/caddy -conf /caddy/Caddyfile -quiet
