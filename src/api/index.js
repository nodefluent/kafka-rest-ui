// @flow
import axios from 'axios';

const timeout = 5000;
const instance = axios.create({
  baseURL: 'http://localhost:8082/',
  timeout: timeout + 1000,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
});

export const getTopics = () => instance.get('/topics');
export const getTopic = (topicName :string) => instance.get(`/topics/${topicName}`);

export const createConsumer = (consumerId :string, offset :string = 'earliest') =>
  instance.post(`/consumers/${consumerId}`, {
    name: consumerId,
    format: 'json',
    'auto.offset.reset': offset,
  });

export const deleteConsumer = (consumerId :string, topicName :string) =>
  instance.delete(`/consumers/${consumerId}/instances/${topicName}`);

export const subscribeToTopic = (consumerId :string, topicName :string) =>
  instance.post(`/consumers/${consumerId}/instances/${topicName}/subscription`, {
    topics: [topicName],
  });

export const getRecords = (consumerId :string, topicName :string) =>
  instance.get(`/consumers/${consumerId}/instances/${topicName}/records?timeout=${timeout}`);
