'use strict';

var _ = { compact: require('lodash/compact') };
var React = require('react');
var createReactClass = require('create-react-class');
var partial = require('./partial');

module.exports = createReactClass({
  displayName: 'exports',

  getDefaultProps: function getDefaultProps() {
    return {
      dimensions: [],
      selectedDimensions: [],
      onChange: function onChange() {}
    };
  },

  render: function render() {
    var self = this;
    var selectedDimensions = this.props.selectedDimensions;
    var nSelected = selectedDimensions.length;

    return React.createElement(
      'div',
      { className: 'reactPivot-dimensions' },
      selectedDimensions.map(this.renderDimension),
      React.createElement(
        'select',
        { value: '', onChange: partial(self.toggleDimension, nSelected) },
        React.createElement(
          'option',
          { value: '' },
          'Sub Dimension...'
        ),
        self.props.dimensions.map(function (dimension) {
          return React.createElement(
            'option',
            { key: dimension.title },
            dimension.title
          );
        })
      )
    );
  },

  renderDimension: function renderDimension(selectedDimension, i) {
    return React.createElement(
      'select',
      {
        value: selectedDimension,
        onChange: partial(this.toggleDimension, i),
        key: selectedDimension },
      React.createElement('option', null),
      this.props.dimensions.map(function (dimension) {
        return React.createElement(
          'option',
          {
            value: dimension.title,
            key: dimension.title },
          dimension.title
        );
      })
    );
  },

  toggleDimension: function toggleDimension(iDimension, evt) {
    var dimension = evt.target.value;
    var dimensions = this.props.selectedDimensions;

    var curIdx = dimensions.indexOf(dimension);
    if (curIdx >= 0) dimensions[curIdx] = null;
    dimensions[iDimension] = dimension;

    var updatedDimensions = _.compact(dimensions);

    this.props.onChange(updatedDimensions);
  }
});