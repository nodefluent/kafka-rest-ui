FROM node:alpine
MAINTAINER nodefluent

ENV KAFKA_REST_UI_VERSION=0.6.1

WORKDIR /
COPY ./Caddyfile /caddy/Caddyfile
COPY ./entrypoint.sh /entrypoint.sh

RUN apk add --no-cache libcap bash curl git \
    \
    && mkdir -p /caddy \
    && curl --silent --show-error --fail --location \
      --header "Accept: application/tar+gzip, application/x-gzip, application/octet-stream" -o - \
      "https://caddyserver.com/download/linux/amd64?plugins=http.ipfilter,http.cors" \
    | tar --no-same-owner -C /caddy -xz caddy \
    && setcap 'cap_net_bind_service=+ep' /caddy/caddy \
    && /caddy/caddy -version \
    \
    && git clone https://github.com/nodefluent/kafka-rest-ui.git \
    && cd kafka-rest-ui \
    && yarn install \
    \
    && chmod +x /entrypoint.sh

WORKDIR /kafka-rest-ui
EXPOSE ${HTTP_PORT:-8000}
CMD ["/entrypoint.sh"]
