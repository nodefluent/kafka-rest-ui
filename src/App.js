// @flow
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import { ic_list } from 'react-icons-kit/md/ic_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';
import { connect } from 'react-redux';
import NotificationSystem from 'react-notification-system';

import { created } from './ducks/consumers';
import { mounted } from './ducks/topics';

import type { Consumers, Topics } from './types';
import logo from './logo.svg';
import './App.css';

type Props = {
  created: void,
  mounted: void,
  topics: Topics,
  consumers: Consumers,
};

class App extends Component<Props> {
  componentDidMount() {
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
      });
    }
    if (newProps.topics.error) {
      this.notificationSystem.addNotification({
        title: 'The problem with topic occurred',
        message: newProps.topics.error,
        level: 'error',
      });
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
          Kafka Rest UI
        </div>
        <div style={{ height: '100%' }} >
          <div style={{
            background: '#2c3e50',
            color: '#FFF',
            width: '20%',
            float: 'left',
          }}
          >
            <SideNav
              highlightBgColor="#7d7d7d"
              defaultSelected="topics"
              onItemSelection={this.props.created}
            >
              {console.log('render', this)}
              {this.props.topics.list.map((topic, index) =>
                (<Nav id={topic} key={`topic${index}`}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>{topic}</NavText>
                </Nav>))
              }
              {this.props.topics.list.length === 0 && (
                <Nav key={'__notopic'}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>No topic found</NavText>
                </Nav>)
              }
            </SideNav>
          </div>
          {this.props.consumers.loading && <Icon className="load" icon={ic_loop} /> }
          {!this.props.consumers.loading &&
            <div style={{ display: 'flex' }}>
              <ReactJson src={this.props.consumers.records} name={null} displayDataTypes={false} />
            </div>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ consumers, topics }) => ({ consumers, topics });

const mapDispatchToProps = { created, mounted };

export default connect(mapStateToProps, mapDispatchToProps)(App);
