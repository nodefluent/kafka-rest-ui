// @flow

export const topicPartitionColumns = [
  {
    id: 'partition',
    Header: 'Partition',
    accessor: 'partition',
  },
  {
    id: 'broker',
    Header: 'Broker',
    accessor: 'broker',
  },
  {
    id: 'leader',
    Header: 'Is Leader',
    accessor: (d :Object) => d.leader.toString(),
  },
  {
    id: 'in_sync',
    Header: 'Is in sync',
    accessor: (d :Object) => d.in_sync.toString(),
  },
];

export const topicConfigColumns = [
  {
    id: 'config',
    Header: 'Config',
    accessor: 'config',
    width: 200,
  },
  {
    id: 'value',
    Header: 'Value',
    accessor: 'value',
    width: 200,
  },
  {
    id: 'default',
    Header: 'Default',
    accessor: 'default',
    width: 200,
  },
  {
    id: 'description',
    Header: 'Description',
    accessor: 'description',
    style: {
      wordWrap: 'break-word',
      whiteSpace: 'normal',
    },
  },
];

export const consumerColumns = [
  {
    id: 'consumerId',
    Header: 'Id',
    accessor: 'consumerId',
  },
  {
    id: 'topicName',
    Header: 'Topic',
    accessor: 'topicName',
  },
  {
    id: 'offset',
    Header: 'Offset',
    accessor: 'offset',
    width: 150,
  },
  {
    id: 'status',
    Header: 'Status',
    accessor: 'status',
    width: 150,
  },
];

export const messageColumns = [
  {
    id: 'offset',
    Header: 'Offset',
    accessor: 'offset',
    width: 100,
  },
  {
    id: 'key',
    Header: 'Key',
    accessor: 'key',
    width: 150,
  },
  {
    id: 'value',
    Header: 'Value',
    accessor: (m :Object) => (m.value ? JSON.stringify(m.value) : 'null'),
    style: {
      wordWrap: 'break-word',
      whiteSpace: 'normal',
    },
    filterMethod: (filter, row) => row[filter.id].includes(filter.value),
  },
];
