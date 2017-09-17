## Kafka REST UI
[![Dependency Status](https://david-dm.org/nodefluent/kafka-rest-ui.svg)](https://david-dm.org/nodefluent/kafka-rest-ui)

Kafka rest ui is a kafka topics browser.

#### Features:
- Find kafka topics
- View topic metadata
- Browse topic data (kafka messages)
- View topic configuration

![Preview](https://raw.githubusercontent.com/nodefluent/kafka-rest-ui/master/preview.png)

## Docker

#### Configurations

- REACT_APP_KAFKA_REST_URL
- REACT_APP_PROXY
- REACT_APP_TIMEOUT
- REACT_APP_LOCAL_STORAGE
- REACT_APP_DEBUG

#### docker-compose example

```yaml
version: "2"
services:
  zookeeper:
    image: wurstmeister/zookeeper:latest
    ports:
      - 2181:2181

  kafka:
    image: wurstmeister/kafka:0.10.2.1
    ports:
      - "9092:9092"
    links:
      - zookeeper
    depends_on:
      - zookeeper
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_PORT: 9092
      KAFKA_ADVERTISED_HOST_NAME: "kafka"
      KAFKA_ADVERTISED_LISTENERS: "PLAINTEXT://kafka:9092"
      KAFKA_LISTENERS: "PLAINTEXT://:9092"
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_CREATE_TOPICS: "test:1:1"
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"

  kafka-rest:
    image: nodefluent/kafka-rest
    ports:
      - 8082:8082
    links:
      - kafka
      - zookeeper
    depends_on:
      - kafka
      - zookeeper
    environment:
      DEBUG: "*"

  kafka-rest-ui:
    image: nodefluent/kafka-rest-ui
    ports:
      - 8000:8000
    links:
      - kafka-rest
    depends_on:
      - kafka-rest
    environment:
      DEBUG: "*"
      REACT_APP_KAFKA_REST_URL: "http://kafka-rest:8082/"
      REACT_APP_TIMEOUT: "3000"
      PROXY: "yes"
      BASIC_AUTH_USER: "admin"
      BASIC_AUTH_PASSWORD: "admin"
```

## TODO

- [ ] Replace caddy server with nginx
- [ ] Add multi enpoint support
- [ ] refactor mapping in reducers
- [ ] write some tests
- [ ] write better documentation
