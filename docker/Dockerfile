FROM node:alpine
MAINTAINER nodefluent

ENV KAFKA_REST_UI_VERSION=0.2.0

WORKDIR /
COPY ./entrypoint.sh /entrypoint.sh

RUN apk add --no-cache bash curl git \
    \
    && yarn global add serve \
    && echo "serve version $(serve --version)" \
    \
    && git clone https://github.com/nodefluent/kafka-rest-ui.git \
    && cd kafka-rest-ui \
    && yarn install \
    \
    && chmod +x /entrypoint.sh

WORKDIR /kafka-rest-ui
EXPOSE ${HTTP_PORT:-8000}
ENTRYPOINT ["/entrypoint.sh"]
