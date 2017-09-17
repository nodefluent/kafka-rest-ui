// @flow
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import ReactTable from 'react-table';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import Pager from 'react-pager';
import { ic_view_list } from 'react-icons-kit/md/ic_view_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';
import { ic_description } from 'react-icons-kit/md/ic_description';
import { ic_hearing } from 'react-icons-kit/md/ic_hearing';
import { ic_reorder } from 'react-icons-kit/md/ic_reorder';
import { ic_search } from 'react-icons-kit/md/ic_search';
import { ic_settings } from 'react-icons-kit/md/ic_settings';
import { ic_timeline } from 'react-icons-kit/md/ic_timeline';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button, FormGroup, ControlLabel, FormControl, HelpBlock, Panel } from 'react-bootstrap';
// $FlowIgnore
import 'react-tabs/style/react-tabs.css';
// $FlowIgnore
import 'react-table/react-table.css';

import { createConsumer, clear as consumersClear, setPage } from './ducks/consumers';
import { getTopics, clear as topicsClear } from './ducks/topics';
import { setTabIndex, setRequestTimeout, setUrl, setWindow } from './ducks/settings';

import { messageColumns, consumerColumns, topicConfigColumns, topicPartitionColumns } from './styles';
import type { Consumers, Topics, Settings } from './types';
import logo from './logo.svg';
import nodefluent from './nodefluent.png';
import './App.css';

type Props = {
  createConsumer: void,
  getTopics: void,
  setRequestTimeout: void,
  setUrl: void,
  setPage: void,
  setTabIndex: void,
  setWindow: void,
  consumersClear: void,
  topicsClear: void,
  topics: Topics,
  consumers: Consumers,
  settings: Settings
};

class App extends Component<Props> {
  componentDidMount() {
    if (process.env.REACT_APP_KAFKA_REST_URL) {
      if (this.props.setUrl) this.props.setUrl(process.env.REACT_APP_KAFKA_REST_URL);
    }
    if (process.env.REACT_APP_TIMEOUT) {
      if (this.props.setRequestTimeout) this.props.setRequestTimeout(parseInt(process.env.REACT_APP_TIMEOUT, 10));
    }
    if (this.props.consumersClear) this.props.consumersClear();
    if (this.props.getTopics) {
      this.props.getTopics();
      setTimeout(this.props.getTopics, 1000); // if persist rewrite topics
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.consumers.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with consumer occurred',
        message: newProps.consumers.error,
        level: 'error',
        autoDismiss: 0,
        // position: 'br',
      });
      if (this.props.consumersClear) this.props.consumersClear();
    }
    if (newProps.topics.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with topic occurred',
        message: newProps.topics.error,
        level: 'error',
        autoDismiss: 0,
        // position: 'br',
      });
      if (this.props.topicsClear) this.props.topicsClear();
    }
  }

  refs: any;
  notificationSystem: NotificationSystem;

  render() {
    return (
      <div className="App">
        <NotificationSystem ref={(c) => { this.notificationSystem = c; }} />
        <div className="App-header">
          <span style={{
            fontSize: '1.5em',
            position: 'absolute',
            top: '6px' }}
          ><img src={logo} className="App-logo" alt="logo" />Kafka REST UI</span>
        </div>
        <div className="FullHeight">
          <div className="SideNav">
            <div style={{
              height: '-webkit-calc(100% - 42px)',
              overflow: 'auto',
            }}
            >
              <SideNav
                highlightBgColor="#6e8294"
                defaultSelected="topics"
                onItemSelection={!this.props.consumers.loading ?
                  (topicId, parent) => {
                    const topicName = topicId.replace(`${parent}/`, '');
                    if (this.props.createConsumer) this.props.createConsumer(topicName);
                    if (this.props.setTabIndex) this.props.setTabIndex(0);
                    if (this.props.setPage) this.props.setPage(0);
                  } :
                  () => {}}
              >
                <div style={{
                  color: '#AAA',
                  margin: '10px 12px',
                  padding: '4px 12px 2px',
                }}
                >Topics</div>
                {this.props.topics.list.map((topic, index) =>
                  (<Nav id={topic} key={`topic${index}`}>
                    <NavIcon><Icon size={20} icon={ic_view_list} /></NavIcon>
                    <NavText>{topic}</NavText>
                  </Nav>))
                }
              </SideNav>
              <div style={{
                color: '#AAA',
                margin: '10px 12px 0px 12px',
                padding: '4px 12px 2px',
                height: '42px',
                position: 'absolute',
                bottom: '0',
                left: '0',
              }}
              >
                <a
                  style={{ color: '#AAA', cursor: 'pointer' }}
                  href="https://github.com/nodefluent"
                  target="_blank"
                  rel="noopener noreferrer"
                >Powered by nodefluent </a>
                <img src={nodefluent} style={{ height: '32px' }} className="nodefluent-logo" alt="nodefluent" />
              </div>
            </div>
          </div>
          <Tabs
            style={{ height: '-webkit-calc(100% - 44px)' }}
            selectedIndex={this.props.settings.tabIndex}
            onSelect={(tabIndex: number) => {
              if (this.props.setTabIndex) this.props.setTabIndex(tabIndex);
            }}
          >
            <TabList>
              <Tab><Icon size={16} icon={ic_description} /> Raw view</Tab>
              <Tab><Icon size={16} icon={ic_search} /> Table view</Tab>
              <Tab><Icon size={16} icon={ic_reorder} /> Topic partitions</Tab>
              <Tab><Icon size={16} icon={ic_timeline} /> Topic configs</Tab>
              <Tab style={{ float: 'right' }}><Icon size={16} icon={ic_settings} /> Settings</Tab>
              <Tab style={{ float: 'right' }}><Icon size={16} icon={ic_hearing} /> Consumers</Tab>
            </TabList>
            <TabPanel style={{ height: '100%' }}>
              <div className="Messages">
                {this.props.consumers.loading && <div className="Progress">
                  <Icon className="load" icon={ic_loop} />
                  {this.props.consumers.progress}
                </div> }
                {!this.props.consumers.loading && this.props.consumers.records.length > 0 &&
                  <ReactJson
                    src={this.props.consumers.records.length > 0
                      && typeof this.props.consumers.page === 'number'
                      && this.props.consumers.page >= 0 ?
                      this.props.consumers.records[this.props.consumers.page] :
                      this.props.consumers.records}
                    name={null}
                    displayDataTypes={false}
                    iconStyle={'circle'}
                  />}
              </div>
              {!this.props.consumers.loading && this.props.consumers.records.length === 0 &&
                (<div className="NoContent">No records found</div>)}
              <div className="Navigation">
                <div className="NavigationLeft">
                  <Button
                    onClick={!this.props.consumers.loading ?
                      () => {
                        if (!this.props.topics.topic || this.props.topics.topic.name === '') {
                          this.notificationSystem.addNotification({
                            title: 'Topic not selected',
                            message: 'Please select topic first',
                            level: 'info',
                          });
                          return;
                        }
                        const topicName = this.props.topics.topic.name;
                        if (this.props.createConsumer) this.props.createConsumer(topicName, 'earliest');
                      } :
                      () => {}}
                    className="NaviagationButton"
                  >drain earliest
                  </Button>
                </div>
                <div className="NavigationCenter">
                  <Pager
                    total={this.props.consumers.records.length}
                    current={this.props.consumers.page}
                    visiblePages={3}
                    className="NaviagationPager"
                    onPageChanged={this.props.setPage}
                  />
                </div>
                <div className="NavigationRight">
                  <Button
                    onClick={!this.props.consumers.loading ?
                      () => {
                        if (!this.props.topics.topic || this.props.topics.topic.name === '') {
                          this.notificationSystem.addNotification({
                            title: 'Topic not selected',
                            message: 'Please select topic first',
                            level: 'info',
                          });
                          return;
                        }
                        const topicName = this.props.topics.topic.name;
                        if (this.props.createConsumer) this.props.createConsumer(topicName, 'latest');
                      } :
                      () => {}}
                    className="NaviagationButton"
                  >drain latest</Button>
                </div>
              </div>
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <ReactTable
                style={{ height: '100%' }}
                filterable
                sorted={[
                  {
                    id: 'key',
                    desc: false,
                  },
                ]}
                data={this.props.consumers.records}
                columns={messageColumns}
                defaultPageSize={25}
              />
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <ReactTable
                style={{ height: '100%' }}
                sorted={[
                  {
                    id: 'partition',
                    desc: false,
                  },
                ]}
                data={this.props.topics.topic.partitions}
                columns={topicPartitionColumns}
                defaultPageSize={25}
              />
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <ReactTable
                style={{ height: '100%' }}
                filterable
                sorted={[
                  {
                    id: 'config',
                    desc: false,
                  },
                ]}
                data={this.props.topics.topic.configs}
                columns={topicConfigColumns}
                defaultPageSize={25}
              />
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <div style={{ display: 'flex', height: '100%', overflow: 'overlay' }}>
                <form>
                  <table style={{ borderCollapse: 'separate', borderSpacing: '10px' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'top' }}>
                          <Panel
                            header={(<h3>Server settings</h3>)}
                            bsStyle="success"
                          >
                            <FieldGroup
                              id="url"
                              type="url"
                              label="Kafka rest url"
                              value={this.props.settings.url}
                              disabled
                              help="Kafka rest endpoint: REACT_APP_KAFKA_REST_URL"
                            />
                            <FieldGroup
                              id="localstorage"
                              type="text"
                              label="Local storage"
                              value={process.env.REACT_APP_LOCAL_STORAGE !== 'false' ? 'ON' : 'OFF'}
                              disabled
                              help="Proxy mode: REACT_APP_LOCAL_STORAGE"
                            />
                            <FieldGroup
                              id="proxy"
                              type="text"
                              label="Proxy mode"
                              value={process.env.REACT_APP_PROXY ? 'ON' : 'OFF'}
                              disabled
                              help="Proxy mode: REACT_APP_PROXY"
                            />
                            <FieldGroup
                              id="debug"
                              type="text"
                              label="Debug mode"
                              value={process.env.REACT_APP_DEBUG ? 'ON' : 'OFF'}
                              disabled
                              help="Debug mode: REACT_APP_DEBUG"
                            />
                          </Panel>
                        </td>
                        <td style={{ verticalAlign: 'top' }}>
                          <Panel
                            header={(<h3>Client settings</h3>)}
                            bsStyle="info"
                          >
                            <FieldGroup
                              id="timeout"
                              type="number"
                              label="API request timeout"
                              help="Kafka rest request timeout in ms (min: 1000, max: 120000)"
                              value={this.props.settings.timeout}
                              onChange={(event) => {
                                if (event.target.validity.valid && this.props.setRequestTimeout) {
                                  this.props.setRequestTimeout(event.target.value);
                                }
                              }}
                              step="100"
                              min="1000"
                              max="120000"
                            />
                            <FieldGroup
                              id="window"
                              type="number"
                              label="API max window size"
                              help="Kafka rest max messages per request (min: 1, max: 100000)"
                              value={this.props.settings.window}
                              onChange={(event) => {
                                if (event.target.validity.valid && this.props.setWindow) {
                                  this.props.setWindow(event.target.value);
                                }
                              }}
                              step="1"
                              min="1"
                              max="100000"
                            />
                          </Panel>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
            </TabPanel>
            <TabPanel style={{ height: '100%' }}>
              <ReactTable
                style={{ height: '100%' }}
                filterable
                sorted={[
                  {
                    id: 'consumerId',
                    desc: true,
                  },
                ]}
                data={this.props.consumers.list}
                columns={consumerColumns}
                defaultPageSize={25}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

const mapStateToProps = ({ consumers, topics, settings }) => ({ consumers, topics, settings });

const mapDispatchToProps = {
  consumersClear,
  createConsumer,
  getTopics,
  setPage,
  setRequestTimeout,
  setUrl,
  setTabIndex,
  setWindow,
  topicsClear,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
