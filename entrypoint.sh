#!/bin/bash

set -e

if [ -z "${DEBUG}" ]; then
  set +o xtrace
else
  set -o xtrace
fi

export REACT_APP_KAFKA_REST_URL="${REACT_APP_KAFKA_REST_URL:-http://localhost:8082}"
export REACT_APP_TIMEOUT="${REACT_APP_TIMEOUT:-2000}"
export REACT_APP_PROXY="${PROXY}"
export PROXY_URL="${PROXY_URL}"
export REACT_APP_DEBUG="${DEBUG}"
export HTTP_PORT=${HTTP_PORT:-8000}
export BASIC_AUTH_USER=${BASIC_AUTH_USER}
export BASIC_AUTH_PASSWORD=${BASIC_AUTH_PASSWORD}
export BASIC_AUTH=""

if [[ -z "$REACT_APP_KAFKA_REST_URL" ]]; then
    echo "Kafka REST URL was not set via REACT_APP_KAFKA_REST_URL environment variable."
fi

if echo "$PROXY" | grep -sqE "true|TRUE|y|Y|yes|YES|1"; then
  export PROXY_URL=${REACT_APP_KAFKA_REST_URL}
  export REACT_APP_KAFKA_REST_URL="/api/kafka-rest"
  envsubst '$REACT_APP_KAFKA_REST_URL $PROXY_URL' < /etc/nginx/conf.d/kafka-rest-ui-proxy-location.template > /etc/nginx/conf.d/kafka-rest-ui-proxy.location
  cat /etc/nginx/conf.d/kafka-rest-ui-proxy.location
fi

if [ ! -z "${BASIC_AUTH_USER}" ]; then
	htpasswd -cb /etc/nginx/.htpasswd "${BASIC_AUTH_USER}" "${BASIC_AUTH_PASSWORD}"
	export BASIC_AUTH='auth_basic "Restricted";
      auth_basic_user_file /etc/nginx/.htpasswd;'
fi

envsubst '$HTTP_PORT $BASIC_AUTH' < /etc/nginx/conf.d/kafka-rest-ui.template > /etc/nginx/conf.d/kafka-rest-ui.conf
cat /etc/nginx/conf.d/kafka-rest-ui.conf

if [[ "${BUILD}" != "localhost" ]]; then
    echo "Building application..."
    yarn build
fi

echo
echo "Starting server..."
echo "http://0.0.0.0:${HTTP_PORT}"
exec nginx -g "daemon off;"
