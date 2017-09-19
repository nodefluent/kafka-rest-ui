// @flow
import React from 'react';
import JSONTree from 'react-json-tree';

export const monokaiTheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

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
    accessor: 'value',
    style: {
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap',
    },
    filterMethod: (filter: any, row: any) => JSON.stringify(row[filter.id]).includes(filter.value),
    Cell: (row: any) => (
      (row.value && typeof row.value === 'object' &&
      <JSONTree
        data={row.value}
        theme={monokaiTheme}
        invertTheme
        hideRoot
        shouldExpandNode={() => true}
      />) ||
      (typeof row.value === 'string' && <div>{row.value}</div>)
    ),
  },
];
