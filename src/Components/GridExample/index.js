import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.css';
import loremIpsum from 'lorem-ipsum';
import { Grid } from "react-virtualized";


class GridExample extends Component {
  constructor() {
    super();
    this.cellRenderer = this.cellRenderer.bind(this);
    this.rowCount = 2000000;
    this.list = Array(this.rowCount).fill().map((val, idx) => {
      return ([
        idx,
        Math.floor(Math.random() * 600) + 1,
        Math.floor(Math.random() * 600) + 1,
        Math.floor(Math.random() * 600) + 1,
        loremIpsum({
          count: 1,
          units: 'sentences',
          sentenceLowerBound: 1,
          sentenceUpperBound: 5
        })])
      }
    )
  }

  cellRenderer({ columnIndex, key, rowIndex, style }) {
  return (
    <div
      key={key}
      style={style}
    >
      {this.list[rowIndex][columnIndex]}
    </div>
  )
}

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Grid Example of {this.rowCount} records</h1>
        </header>
        <div className="list">
        <Grid
          cellRenderer={this.cellRenderer}
          columnCount={this.list[0].length}
          columnWidth={300}
          height={600}
          rowCount={this.list.length}
          rowHeight={30}
          width={1800}
        />
        </div>
      </div>
    );
  }
}

export default GridExample;