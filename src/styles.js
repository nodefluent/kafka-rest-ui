// @flow
export const colorTheme = {
  scheme: 'google',
  base00: '#1d1f21',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',
};

export const topicPartitionColumns = [
  {
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
    accessor: d => d.leader.toString(),
  },
  {
    id: 'in_sync',
    Header: 'Is in sync',
    accessor: d => d.in_sync.toString(),
  },
];