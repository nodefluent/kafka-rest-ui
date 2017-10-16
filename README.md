## Kafka REST UI :mushroom:
[![Dependency Status](https://david-dm.org/nodefluent/kafka-rest-ui.svg)](https://david-dm.org/nodefluent/kafka-rest-ui)

Kafka rest ui is a kafka topics browser.

> NOTE: the goal of this project is to offer a fast user interface [kafka-rest](https://github.com/nodefluent/kafka-rest).

#### Features:

- View kafka topics
- View topic metadata
- Browse kafka messages (with offline storage)
- Filter kafka messages
- View topic configuration
- View consumers status

![Preview](https://raw.githubusercontent.com/nodefluent/kafka-rest-ui/master/preview.png)

## Docker

#### Configurations

- env `REACT_APP_KAFKA_REST_URL` - set kafka-rest url
- env `REACT_APP_PROXY` - set proxy mode
- env `REACT_APP_TIMEOUT` - set default timeout (you can change it via settings tab)
- env `REACT_APP_LOCAL_STORAGE` - set to 'false' if you don't want to use local storage
- env `REACT_APP_DEBUG` - turn on debug mode

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

- [x] Replace caddy server with nginx
- [ ] Add multi enpoint support
- [ ] refactor mapping in reducers
- [ ] write some tests
