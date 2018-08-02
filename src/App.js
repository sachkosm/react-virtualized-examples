import React, { Component } from 'react';
import GridExample from './Components/GridExample/';
import ListExample from './Components/ListExample/';
import ListNotVirtualized from './Components/ListNotVirtualized/';
import './App.css';

class App extends Component {
  constructor(props, context) {

    super(props)
    this.returnSelected = this.returnSelected.bind(this)
    this.returnComponent = this.returnComponent.bind(this)
    this.state = {
      selectedId: 0
    }
  }

  returnSelected(item) {
    console.log(item.target.id)
    this.setState({ selectedId: item.target.id })
    return false;
  }

  returnComponent() {
    switch (this.state.selectedId) {
      case '1':
        return (<ListNotVirtualized />)
        break;
      case '2':
        return (<ListExample />)
        break;
      case '3':
        return (<GridExample />)
        break;
      default:
        return (<div>
          Please select a component
        </div>)
    }
  }

  render() {
    return (
      <div>
        <ul>
          <li><button id='1' onClick={this.returnSelected} >List Example Not Virtualized 200k</button></li>
          <li><button id='2' onClick={this.returnSelected} >List Example 2M</button></li>
          <li><button id='3' onClick={this.returnSelected} >Grid Example 2M</button></li>
        </ul>
        <div>{this.returnComponent()}</div>
      </div>
    )
  }

}
export default App;

//https://blog.logrocket.com/rendering-large-lists-with-react-virtualized-82741907a6b3
