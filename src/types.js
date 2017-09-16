// @flow

export type Consumers = {
  list: Array<Object>,
  records: Array<any>,
  loading: boolean,
  error?: string,
  progress?: string,
  timeout?: number,
  page?: number,
}

export type ConsumerAction = {
  type: string,
  message?: ?Error,
  consumerId?: string,
  topicName?: string,
  offset?: string,
  timeout?: number,
  page?: number,
}

export type Topics = {
  list: Array<any>,
  topic: {
    name: string,
    partitions?: Array<Object>,
    configs?: Array<Object>,
  },
  loading: boolean,
  error?: string,
}

export type TopicAction = {
  type: string,
  message?: Error,
  topic?: {
    name: string,
  },
  payload?:{
    partitions: Array<Object>,
    configs: Array<Object>,
  }
}

export type Settings = {
  url: string,
  timeout: number,
  window: number,
  error?: string,
}

export type SettingAction = {
  type: string,
  message?: Error,
  timeout?: number,
  window?: number,
}
