import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.css';
import loremIpsum from 'lorem-ipsum';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache, ScrollSync } from "react-virtualized";



class ListExample extends Component {
  constructor() {
    super();
    this.rowCount = 2000000;
    this.renderRow = this.renderRow.bind(this);

    this.list = Array(this.rowCount).fill().map((val, idx) => {
      return {
        id: idx,
        tradePrice1: Math.floor(Math.random() * 600) + 1,
        tradePrice2: Math.floor(Math.random() * 600) + 1,
        tradePrice3: Math.floor(Math.random() * 600) + 1,
        text: loremIpsum({
          count: 1,
          units: 'sentences',
          sentenceLowerBound: 1,
          sentenceUpperBound: 5
        })
      }
    })

    this.cache = new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 100
    })
  }
  renderRow({ index, key, style, parent }) {
    return (
      <CellMeasurer
        key={key}
        cache={this.cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}>
        <div key={key} style={style} className="row">
          <div className="content">
            {this.list[index].id+1}
          </div>
          <div className="content">
            <div>{this.list[index].tradePrice1}&nbsp;</div>
          </div>
          <div className="content">
            <div>{this.list[index].tradePrice2}&nbsp;</div>
          </div>
          <div className="content">
            <div>{this.list[index].tradePrice3}&nbsp;</div>
          </div>
          <div className="content">
            <div>{this.list[index].text}</div>
          </div>
        </div>
      </CellMeasurer>
    );
  }
  render() {
    // const listHeight = 600;
    // const rowHeight = 50;
    // const rowWidth = 800;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">List Example of {this.rowCount} records</h1>
        </header>
        <header className="App-table-header">
        <div  className="row">
          <div className="content">
            id
          </div>
          <div className="content">
            <div>tradePrice1&nbsp;</div>
          </div>
          <div className="content">
            <div>tradePrice2&nbsp;</div>
          </div>
          <div className="content">
            <div>tradePrice3&nbsp;</div>
          </div>
          <div className="content">
            <div>Text</div>
          </div>
        </div>
        </header>
        <ScrollSync>
          {({ onScroll, scrollTop, scrollLeft }) => (
            <div className="list">
              
              <AutoSizer>
                {({ width, height }) => {
                  return <List
                    width={width}
                    height={height}
                    deferredMeasurementCache={this.cache}
                    rowHeight={this.cache.rowHeight}
                    onScroll={onScroll}
                    rowRenderer={this.renderRow}
                    rowCount={this.list.length}
                    overscanRowCount={3} />
                }}
              </AutoSizer>
            </div>
          )}
        </ScrollSync>
      </div>
    );
  }
}

export default ListExample;

//https://blog.logrocket.com/rendering-large-lists-with-react-virtualized-82741907a6b3
