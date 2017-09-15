// @flow
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';
import ReactTable from 'react-table';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import Pager from 'react-pager';
import { ic_list } from 'react-icons-kit/md/ic_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Button } from 'react-bootstrap';
// $FlowIgnore
import 'react-tabs/style/react-tabs.css';
// $FlowIgnore
import 'react-table/react-table.css';

import { createConsumer, clear as consumersClear, setPage } from './ducks/consumers';
import { getTopics, clear as topicsClear } from './ducks/topics';
import { setTimeout, setUrl } from './ducks/settings';

import { colorTheme, topicPartitionColumns } from './styles';
import type { Consumers, Topics, Settings } from './types';
import logo from './logo.svg';
import './App.css';

type Props = {
  createConsumer: void,
  getTopics: void,
  setTimeout: void,
  setUrl: void,
  setPage: void,
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
      if (this.props.setTimeout) this.props.setTimeout(parseInt(process.env.REACT_APP_TIMEOUT, 10));
    }
    if (this.props.getTopics) this.props.getTopics();
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
          <img src={logo} className="App-logo" alt="logo" />
          <span style={{ fontSize: '1.5em' }}>Kafka REST UI</span>
        </div>
        <div className="FullHeight">
          <div className="SideNav">
            <SideNav
              highlightBgColor="#6e8294"
              defaultSelected="topics"
              onItemSelection={!this.props.consumers.loading ?
                (topicId, parent) => {
                  const topicName = topicId.replace(`${parent}/`, '');
                  if (this.props.createConsumer) this.props.createConsumer(topicName);
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
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>{topic}</NavText>
                </Nav>))
              }
            </SideNav>
          </div>
          <Tabs style={{ height: '-webkit-calc(100% - 44px)' }}>
            <TabList>
              <Tab>Messages</Tab>
              <Tab>All Messages</Tab>
              <Tab>Partitions</Tab>
              <Tab>Configs</Tab>
              <Tab style={{ float: 'right' }}>Settings</Tab>
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
                (<div className="NoContent">No records found</div>)}
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
              <div className="NoContent">No topic configuration found</div>
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
                      if (event.target.validity.valid && this.props.setTimeout) {
                        this.props.setTimeout(event.target.value);
                      }
                    }}
                    step="100"
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

const mapDispatchToProps = { createConsumer, getTopics, setTimeout, setUrl, setPage, consumersClear, topicsClear };

export default connect(mapStateToProps, mapDispatchToProps)(App);
