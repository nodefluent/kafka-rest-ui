#!/bin/bash
CONSUMER_PREFIX="peter"
TOPIC="test"

for index in {0..6}
do
  echo
  echo "Create ${CONSUMER_PREFIX}-${index}."
  curl -X POST \
    "http://localhost:8082/consumers/${CONSUMER_PREFIX}-${index}" \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -d '{
      "name": "peter",
      "format": "json",
      "auto.offset.reset": "earliest"
    }'

  curl -X POST \
    http://localhost:8082/consumers/${CONSUMER_PREFIX}-${index}/instances/${CONSUMER_PREFIX}-${index}/subscription \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json' \
    -d "{
      \"topics\": [\"${TOPIC}\"]
    }"
done

echo
echo "Wait for 7 seconds..."
sleep 7

for index in {0..6}
do
  echo
  echo "Get records from ${CONSUMER_PREFIX}-${index}."
  curl -X GET \
    http://localhost:8082/consumers/${CONSUMER_PREFIX}-${index}/instances/${CONSUMER_PREFIX}-${index}/records \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json'
done

echo
for index in {0..6}
do
  echo "Deleting consumer ${CONSUMER_PREFIX}-${index}."
  curl -X DELETE \
    http://localhost:8082/consumers/${CONSUMER_PREFIX}-${index}/instances/${CONSUMER_PREFIX}-${index} \
    -H 'cache-control: no-cache' \
    -H 'content-type: application/json'
done
