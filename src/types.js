// @flow

export type Consumers = {
  list: Object,
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
  timeout?: number,
  page?: number,
}

export type Topics = {
  list: Array<any>,
  topic: {
    name: string,
    partitions?: Array<Object>,
  },
  loading: boolean,
  error?: string,
}

export type TopicAction = {
  type: string,
  message?: Error,
  topic?: {
    name: string,
    partiotions: Array<Object>
  }
}

export type Settings = {
  url: string,
  timeout: number,
  error?: string,
}

export type SettingAction = {
  type: string,
  message?: Error,
  timeout?: number,
}
