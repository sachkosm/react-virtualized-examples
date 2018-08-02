import React, { Component } from 'react';
import logo from './logo.svg';
import './styles.css';
import loremIpsum from 'lorem-ipsum';
import { Column, Table } from "react-virtualized";


class TableExample extends Component {
  constructor() {
    super();
    this.rowCount = 2000000;
    this.list = Array(this.rowCount).fill().map((val, idx) => {
      return ({
        id: idx,
        low: Math.floor(Math.random() * 600) + 1,
        high: Math.floor(Math.random() * 600) + 1,
        avr: Math.floor(Math.random() * 600) + 1,
        description: loremIpsum({
          count: 1,
          units: 'sentences',
          sentenceLowerBound: 1,
          sentenceUpperBound: 5
        })
      })
    }
    )
  }



  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Table Example of {this.rowCount} records</h1>
        </header>
        <div className='flexContainer' >
          <Table
            width={1000}
            height={600}
            headerHeight={20}
            rowHeight={30}
            rowCount={this.list.length}
            rowGetter={({ index }) => this.list[index]}
          >
            <Column
              label='id'
              dataKey='id'
              width={100}
            />
            <Column
              width={200}
              label='low'
              dataKey='low'
            />
            <Column
              width={200}
              label='high'
              dataKey='high'
            />
            <Column
              width={200}
              label='avr'
              dataKey='avr'
            />
            <Column
              width={200}
              label='Description'
              dataKey='description'
            />
          </Table>
       </div>
      </div>
    );
  }
}

export default TableExample;