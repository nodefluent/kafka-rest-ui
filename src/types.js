// @flow

export type Consumers = {
  list: Object,
  records: Array<any>,
  loading: boolean,
  error?: string,
}

export type ConsumerAction = {
  type: string,
  message?: ?Error,
  consumerId?: string,
  topicName?: string,
}

export type Topics = {
  list: Array<any>,
  loading: boolean,
  error?: string,
}

export type TopicAction = {
  type: string,
  message?: Error,
}
