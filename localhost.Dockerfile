FROM node:alpine
MAINTAINER nodefluent

ENV KAFKA_REST_UI_VERSION=0.6.3
ENV REACT_APP_KAFKA_REST_URL=http://localhost:8082
ENV PROXY=true
ENV NODE_ENV=production
ENV BUILD=localhost
ENV DEBUG=-*babel*,-*eslint*,*
COPY . /usr/share/nginx/kafka-rest-ui/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/kafka-rest-ui.template /etc/nginx/conf.d/kafka-rest-ui.template
COPY ./nginx/kafka-rest-ui-proxy-location.template /etc/nginx/conf.d/kafka-rest-ui-proxy-location.template
WORKDIR /usr/share/nginx/kafka-rest-ui/

RUN apk update \
	&& apk add --no-cache libcap bash curl nginx gettext apache2-utils \
	&& ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && yarn install \
    && /usr/share/nginx/kafka-rest-ui/entrypoint.sh \
    && rm -rf /usr/share/nginx/kafka-rest-ui/node_modules/

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]
