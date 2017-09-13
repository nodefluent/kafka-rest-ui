import React, { Component } from 'react';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import Icon from 'react-icons-kit';
import { ic_list } from 'react-icons-kit/md/ic_list';
import { ic_loop } from 'react-icons-kit/md/ic_loop';

import ReactJson from 'react-json-view';

import axios from 'axios';

import logo from './logo.svg';
import './App.css';

const timeout = 5000;
const instance = axios.create({
  baseURL: 'http://localhost:8082/',
  timeout: timeout + 1000,
  headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      topicData: [],
      loading: false,
    };
  }

  componentDidMount() {
    instance.get('topics').then((res) => {
      console.log('/topics', res);
      const topics = res.data;
      this.setState({ topics });
    });
  }

  getTopic(topicId, parent) {
    const self = this;
    console.log('click', topicId, parent);
    const topicName = topicId.replace(`${parent}/`, '');
    const consumerId = `consumer_${topicName}_${new Date().toISOString()}`;
    self.setState({ loading: true });
    instance.post(`/consumers/${consumerId}`, {
      name: consumerId,
      format: 'json',
      'auto.offset.reset': 'earliest',
    }).then(() => {
      console.log('Create a consumer');
      instance.post(`/consumers/${consumerId}/instances/${topicName}/subscription`, {
        topics: [topicName],
      }).then(() => {
        console.log('Use consumer to subscribe to topic');
        instance.get(`/consumers/${consumerId}/instances/${topicName}/records?timeout=${timeout}`)
          .then((res) => {
            console.log('Fetch data', res);
            const topicData = res.data;
            self.setState({ topicData });
            instance.delete(`/consumers/${consumerId}/instances/${topicName}`)
              .then(() => {
                console.log('Close and remove consumer');
                this.setState({ loading: false });
              });
          });
      });
    })
      .catch((error) => {
        this.setState({ loading: false });
        console.error(error);
      });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          Kafka Rest UI
        </div>
        <div style={{ height: '100%' }} >
          <div style={{
            background: '#2c3e50',
            color: '#FFF',
            width: 250,
            float: 'left',
          }}
          >
            <SideNav
              highlightBgColor="#7d7d7d"
              defaultSelected="topics"
              onItemSelection={this.getTopic.bind(this)}
            >
              {this.state.topics.map((topic, index) =>
                (<Nav id={topic} key={`topic${index}`}>
                  <NavIcon><Icon size={20} icon={ic_list} /></NavIcon>
                  <NavText>
                    {topic}
                  </NavText>
                </Nav>))}
            </SideNav>
          </div>
          {this.state.loading && <Icon className="load" icon={ic_loop} /> }
          {!this.state.loading &&
            <div style={{ display: 'flex' }}>
              <ReactJson src={this.state.topicData} name={null} displayDataTypes={false} />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default App;
