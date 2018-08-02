import React from 'react';
import ReactDOM from 'react-dom';
import ListExample from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ListExample />, div);
  ReactDOM.unmountComponentAtNode(div);
});
