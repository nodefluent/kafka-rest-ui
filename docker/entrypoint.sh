#!/bin/bash

export REACT_APP_KAFKA_REST_URL="${REACT_APP_KAFKA_REST_URL:-http://localhost:8082}"
export REACT_APP_TIMEOUT="${REACT_APP_TIMEOUT:-2000}"
export REACT_APP_PROXY=${PROXY}
export PROXY=${PROXY}
export PROXY_PARAMS=""
export HTTP_PORT=${HTTP_PORT:-8000}
export BASIC_AUTH_USER=${BASIC_AUTH_USER}
export BASIC_AUTH_PASSWORD=${BASIC_AUTH_PASSWORD}

if [[ -z "$REACT_APP_KAFKA_REST_URL" ]]; then
    echo "Kafka REST URL was not set via REACT_APP_KAFKA_REST_URL environment variable."
fi

echo "Building application..."
NODE_ENV=production yarn build

echo
echo "Starting server..."
echo "http://0.0.0.0:${HTTP_PORT}"

if echo "$PROXY" | egrep -sq "true|TRUE|y|Y|yes|YES|1"; then
  PROXY_PARAMS="--cors"
fi

if [ ! -z "$BASIC_AUTH_USER" ]; then
  SERVE_USER=${BASIC_AUTH_USER} SERVE_PASSWORD=${BASIC_AUTH_PASSWORD} serve --auth ${PROXY_PARAMS} --port ${HTTP_PORT} --single build
else
  serve ${PROXY_PARAMS} --port ${HTTP_PORT} --single build
fi
