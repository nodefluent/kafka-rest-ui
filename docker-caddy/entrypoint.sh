#!/bin/bash

if [ -z "${DEBUG}" ]; then
  set +o xtrace
else
  set -o xtrace
fi

export REACT_APP_KAFKA_REST_URL="${REACT_APP_KAFKA_REST_URL:-http://localhost:8082}"
export REACT_APP_TIMEOUT="${REACT_APP_TIMEOUT:-2000}"
export REACT_APP_PROXY="${PROXY}"
export PROXY_SKIP_VERIFY="${PROXY_SKIP_VERIFY:-false}"
export PROXY_URL="${PROXY_URL}"
export HTTP_PORT=${HTTP_PORT:-8000}
export BASIC_AUTH_USER=${BASIC_AUTH_USER}
export BASIC_AUTH_PASSWORD=${BASIC_AUTH_PASSWORD}

if [[ -z "$REACT_APP_KAFKA_REST_URL" ]]; then
    echo "Kafka REST URL was not set via REACT_APP_KAFKA_REST_URL environment variable."
fi

if [ ! -z "$BASIC_AUTH_USER" ]; then
  echo 'basicauth / {$BASIC_AUTH_USER} {$BASIC_AUTH_PASSWORD}' >>/caddy/Caddyfile
fi

if echo "$PROXY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
  PROXY_URL=${REACT_APP_KAFKA_REST_URL}
  REACT_APP_KAFKA_REST_URL="/api/kafka-rest"
  if echo "$PROXY_SKIP_VERIFY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
    echo 'proxy /api/kafka-rest {$PROXY_URL} {
  without /api/kafka-rest
  insecure_skip_verify
}' >>/caddy/Caddyfile
  else
    echo 'proxy /api/kafka-rest {$PROXY_URL} {
  without /api/kafka-rest
}' >>/caddy/Caddyfile
  fi
fi

echo "Building application..."
NODE_ENV=production yarn build

echo
echo "Starting server..."
echo "http://0.0.0.0:${HTTP_PORT}"
cat /caddy/Caddyfile
exec /caddy/caddy -conf /caddy/Caddyfile -quiet
