// @flow
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';
import ReactTable from 'react-table';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import { ic_list } from 'react-icons-kit/md/ic_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// $FlowIgnore
import 'react-tabs/style/react-tabs.css';
// $FlowIgnore
import 'react-table/react-table.css';

import { created, clear as consumersClear } from './ducks/consumers';
import { mounted, clear as topicsClear } from './ducks/topics';
import { setTimeout, setUrl } from './ducks/settings';

import type { Consumers, Topics, Settings } from './types';
import logo from './logo.svg';
import './App.css';

type Props = {
  created: void,
  mounted: void,
  setTimeout: void,
  topics: Topics,
  consumers: Consumers,
  settings: Settings
};


const colorTheme = {
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
const data = [
  {
    partition: 0,
    leader: 0,
    replicas: [
      {
        broker: 1,
        leader: true,
        in_sync: true,
      },
      {
        broker: 2,
        leader: false,
        in_sync: true,
      },
      {
        broker: 3,
        leader: false,
        in_sync: false,
      },
    ],
  },
];

const columns = [
  {
    Header: 'Partition',
    accessor: 'partition',
  },
  {
    Header: 'Replica',
    accessor: 'leader',
  },
  {
    id: 'replicaBroker',
    Header: 'Replica Broker',
    accessor: 'broker',
  },
  {
    Header: 'Is Leader',
    accessor: 'replicas.leader',
  },
  {
    Header: 'Is in-sync',
    accessor: 'replicas.in_sync',
  },
];

class App extends Component<Props> {
  componentDidMount() {
    if (process.env.REACT_APP_KAFKA_REST_URL) {
      this.props.setUrl(process.env.REACT_APP_KAFKA_REST_URL);
    }
    if (process.env.REACT_APP_TIMEOUT) {
      this.props.setTimeout(parseInt(process.env.REACT_APP_TIMEOUT, 10));
    }
    if (this.props.mounted) {
      this.props.mounted();
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.consumers.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with consumer occurred',
        message: newProps.consumers.error,
        level: 'error',
        autoDismiss: 0,
        position: 'br',
      });
      this.props.consumersClear();
    }
    if (newProps.topics.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with topic occurred',
        message: newProps.topics.error,
        level: 'error',
      });
      this.props.topicsClear();
    }
  }

  refs: any;
  notificationSystem: NotificationSystem;

  render() {
    return (
      <div className="App">
        <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <span style={{ fontSize: '1.5em' }}>Kafka REST UI</span>
        </div>
        <div className="FullHeight">
          <div className="SideNav">
            <SideNav
              highlightBgColor="#6e8294"
              defaultSelected="topics"
              onItemSelection={!this.props.consumers.loading ? this.props.created : () => {}}
            >
              {this.props.topics.list.map((topic, index) =>
                (<Nav id={topic} key={`topic${index}`}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>{topic}</NavText>
                </Nav>))
              }
              {this.props.topics.list.length === 0 && (
                <Nav key={'__notopic'}>
                  <NavText>No topic found</NavText>
                </Nav>)
              }
            </SideNav>
          </div>
          <Tabs style={{ height: '-webkit-calc(100% - 42px)' }}>
            <TabList>
              <Tab>Messages</Tab>
              <Tab>Messages (another view)</Tab>
              <Tab>Partitions</Tab>
              <Tab>Configs</Tab>
              <Tab style={{ float: 'right' }}>Settings</Tab>
            </TabList>

            <TabPanel style={{ height: '100%' }}>
              {this.props.consumers.loading && <div className="Progress">
                <Icon className="load" icon={ic_loop} />
                {this.props.consumers.progress}
              </div> }
              {!this.props.consumers.loading && this.props.consumers.records.length > 0 &&
              <div className="Messages">
                <ReactJson
                  src={this.props.consumers.records}
                  name={null}
                  displayDataTypes={false}
                  iconStyle={'circle'}
                />
              </div>}
              {!this.props.consumers.loading && this.props.consumers.records.length === 0 &&
                (<div className="NoContent">No records</div>)}
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              {this.props.consumers.loading && <div className="Progress">
                <Icon className="load" icon={ic_loop} />
                {this.props.consumers.progress}
              </div> }
              {!this.props.consumers.loading && this.props.consumers.records.length > 0 &&
              <div className="Messages">
                <JSONTree
                  data={this.props.consumers.records}
                  theme={colorTheme}
                  hideRoot={false}
                  shouldExpandNode={() => true}
                />
              </div>}
              {!this.props.consumers.loading && this.props.consumers.records.length === 0 &&
                (<div className="NoContent">No records</div>)}
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <ReactTable
                style={{ height: '100%' }}
                data={data}
                columns={columns}
                defaultPageSize={25}
              />
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <div className="NoContent">No topic configs</div>
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <table><tbody>
                <tr><td><div className="FieldLabel">Kafka rest url:</div></td>
                  <td><input
                    type="url"
                    disabled
                    value={this.props.settings.url}
                    // onChange={this.props.setUrl}
                    step="any"
                    className="InputField"
                  /></td></tr>
                <tr><td><div className="FieldLabel">API timeout:</div></td>
                  <td><input
                    type="number"
                    value={this.props.settings.timeout}
                    onChange={(event) => {
                      if (event.target.validity.valid) {
                        this.props.setTimeout(event.target.value);
                      }
                    }}
                    step="any"
                    min="1000"
                    max="120000"
                    className="InputField"
                  /></td></tr>
              </tbody></table>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ consumers, topics, settings }) => ({ consumers, topics, settings });

const mapDispatchToProps = { created, mounted, setTimeout, setUrl, consumersClear, topicsClear };

export default connect(mapStateToProps, mapDispatchToProps)(App);
