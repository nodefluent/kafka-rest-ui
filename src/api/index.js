// @flow
import axios from 'axios';

export const getInstance = (url :string = 'http://localhost:8082/', timeout :number = 2000) => {
  const headers = {
    'content-type': 'application/json',
  };

  if (process.env.REACT_APP_PROXY) {
    // $FlowIgnore
    headers['Access-Control-Allow-Origin'] = process.env.REACT_APP_KAFKA_REST_URL || '*';
    // $FlowIgnore
    headers['Access-Control-Allow-Credentials'] = 'true';
    // $FlowIgnore
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    // $FlowIgnore
    headers['Access-Control-Allow-Headers'] = 'Accept,Authorization,Cache-Control,Content-Type,DNT,If-Modified-Since,Keep-Alive,Origin,User-Agent,X-Mx-ReqToken,X-Requested-With';// eslint-disable-line
  }

  return axios.create({
    baseURL: url,
    withCredentials: !!process.env.REACT_APP_PROXY,
    timeout: ((timeout || 2000) + 1000),
    headers,
  });
};

export const getTopics = (url : string, timeout : number) => getInstance(url, timeout).get('/topics');
export const getTopic = (url : string, timeout : number, topicName :string) =>
  getInstance(url, timeout).get(`/topics/${topicName}`);

export const createConsumer =
  (url : string, timeout : number, consumerId :string, offset :string = 'earliest', maxWindowSize :number = 100) =>
    getInstance(url, timeout).post(`/consumers/${consumerId}`, {
      name: consumerId,
      format: 'json',
      maxWindowSize,
      'auto.offset.reset': offset,
    });

export const deleteConsumer =
  (url : string, timeout : number, consumerId :string, topicName :string) =>
    getInstance(url, timeout).delete(`/consumers/${consumerId}/instances/${topicName}`);

export const subscribeToTopic =
  (url : string, timeout : number, consumerId :string, topicName :string) =>
    getInstance(url, timeout).post(`/consumers/${consumerId}/instances/${topicName}/subscription`, {
      topics: [topicName],
    });

export const getRecords =
  (url : string, timeout : number, consumerId :string, topicName :string) => {
    const params = new URLSearchParams();
    params.append('timeout', timeout.toString() || '2000');

    return getInstance(url, timeout).get(`/consumers/${consumerId}/instances/${topicName}/records`, params);
  };
