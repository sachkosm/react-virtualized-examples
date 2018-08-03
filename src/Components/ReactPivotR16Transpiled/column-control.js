'use strict';

var _ = { without: require('lodash/without') };
var React = require('react');
var createReactClass = require('create-react-class');

module.exports = createReactClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      hiddenColumns: [],
      onChange: function onChange() {}
    };
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'reactPivot-columnControl' },
      !this.props.hiddenColumns.length ? '' : React.createElement(
        'select',
        { value: '', onChange: this.showColumn },
        React.createElement(
          'option',
          { value: '' },
          'Hidden Columns'
        ),
        this.props.hiddenColumns.map(function (column) {
          return React.createElement(
            'option',
            { key: column },
            column
          );
        })
      )
    );
  },

  showColumn: function showColumn(evt) {
    var col = evt.target.value;
    var hidden = _.without(this.props.hiddenColumns, col);
    this.props.onChange(hidden);
  }
});