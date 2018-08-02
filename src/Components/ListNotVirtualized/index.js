import React, { Component } from 'react';
import logo from './logo.svg';
import './style.css';
import loremIpsum from 'lorem-ipsum';



class ListNotVirtualized extends Component {
  constructor() {
    super();
    this.rowCount = 200000;
    this.list = Array(this.rowCount).fill().map((val, idx) => {
      return {
        id: idx,
        name: 'John Doe',
        text: loremIpsum({
          count: 1,
          units: 'sentences',
          sentenceLowerBound: 4,
          sentenceUpperBound: 8
        })
      }
    });
  }
  renderRow(item) {
    return (
      <div key={item.id} className="row">
        <div className="content">
          <div>{item.id}</div>
        </div>
        <div className="content">
          <div>{item.name}</div>
          <div>{item.text}</div>
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Static List of {this.rowCount} records</h1>
        </header>
        <div className="list">
          {this.list.map(this.renderRow)}
        </div>
      </div>
    );
  }
}

export default ListNotVirtualized;
