FROM node:alpine
MAINTAINER nodefluent

ENV KAFKA_REST_UI_VERSION=0.6.2
ENV NODE_ENV=production
COPY . /usr/share/nginx/kafka-rest-ui/
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/kafka-rest-ui.template /etc/nginx/conf.d/kafka-rest-ui.template
COPY ./nginx/kafka-rest-ui-proxy-location.template /etc/nginx/conf.d/kafka-rest-ui-proxy-location.template
WORKDIR /usr/share/nginx/kafka-rest-ui/

RUN apk update \
	&& apk add --no-cache libcap bash curl git nginx gettext apache2-utils \
	&& ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log \
    && yarn install

STOPSIGNAL SIGTERM
EXPOSE ${HTTP_PORT:-8000}
CMD ["./entrypoint.sh"]
