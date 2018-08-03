'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = {
  filter: require('lodash/filter'),
  map: require('lodash/map'),
  find: require('lodash/find')
};
var React = require('react');
var createReactClass = require('create-react-class');
var DataFrame = require('dataframe');
var Emitter = require('wildemitter');
var partial = require('./partial');
var download = require('./download');
var getValue = require('./get-value');
var PivotTable = require('./pivot-table.js');
var Dimensions = require('./dimensions.js');
var ColumnControl = require('./column-control.js');

function loadStyles() {
  require('./style.css');
}

var ReactPivot = function (_React$Component) {
  _inherits(ReactPivot, _React$Component);

  function ReactPivot(props, context) {
    _classCallCheck(this, ReactPivot);

    var _this = _possibleConstructorReturn(this, (ReactPivot.__proto__ || Object.getPrototypeOf(ReactPivot)).call(this, props));

    _this.getColumns = _this.getColumns.bind(_this);
    _this.updateRows = _this.updateRows.bind(_this);
    _this.setDimensions = _this.setDimensions.bind(_this);
    _this.setHiddenColumns = _this.setHiddenColumns.bind(_this);
    _this.setSort = _this.setSort.bind(_this);
    _this.setSolo = _this.setSolo.bind(_this);
    _this.clearSolo = _this.clearSolo.bind(_this);
    _this.downloadCSV = _this.downloadCSV.bind(_this);

    _this.state = function () {
      var allDimensions = props.dimensions;
      var activeDimensions = _.filter(props.activeDimensions, function (title) {
        return _.find(allDimensions, function (col) {
          return col.title === title;
        });
      });

      return {
        dimensions: activeDimensions,
        calculations: {},
        sortBy: props.sortBy,
        sortDir: props.sortDir,
        hiddenColumns: props.hiddenColumns,
        solo: props.solo,
        rows: []
      };
    }();

    return _this;
  }

  _createClass(ReactPivot, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.defaultStyles) loadStyles();

      this.dataFrame = DataFrame({
        rows: this.props.rows,
        dimensions: this.props.dimensions,
        reduce: this.props.reduce
      });

      this.updateRows();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      if (newProps.hiddenColumns !== this.props.hiddenColumns) {
        this.setHiddenColumns(newProps.hiddenColumns);
      }

      if (newProps.rows !== this.props.rows) {
        this.dataFrame = DataFrame({
          rows: newProps.rows,
          dimensions: this.props.dimensions,
          reduce: this.props.reduce
        });

        this.updateRows();
      }
    }
  }, {
    key: 'getColumns',
    value: function getColumns() {
      var self = this;
      var columns = [];

      this.state.dimensions.forEach(function (title) {
        var d = _.find(self.props.dimensions, function (col) {
          return col.title === title;
        });

        columns.push({
          type: 'dimension', title: d.title, value: d.value,
          className: d.className, template: d.template
        });
      });

      this.props.calculations.forEach(function (c) {
        if (self.state.hiddenColumns.indexOf(c.title) >= 0) return;

        columns.push({
          type: 'calculation', title: c.title, template: c.template,
          value: c.value, className: c.className
        });
      });

      return columns;
    }
  }, {
    key: 'updateRows',
    value: function updateRows() {
      var columns = this.getColumns();

      var sortByTitle = this.state.sortBy;
      var sortCol = _.find(columns, function (col) {
        return col.title === sortByTitle;
      }) || {};
      var sortBy = sortCol.type === 'dimension' ? sortCol.title : sortCol.value;
      var sortDir = this.state.sortDir;

      var calcOpts = {
        dimensions: this.state.dimensions,
        sortBy: sortBy,
        sortDir: sortDir,
        compact: this.props.compact
      };

      var filter = this.state.solo;
      if (filter) {
        calcOpts.filter = function (dVals) {
          var pass = true;
          Object.keys(filter).forEach(function (title) {
            if (dVals[title] !== filter[title]) pass = false;
          });
          return pass;
        };
      }

      var rows = this.dataFrame.calculate(calcOpts);
      this.setState({ rows: rows });
      this.props.onData(rows);
    }
  }, {
    key: 'setDimensions',
    value: function setDimensions(updatedDimensions) {
      this.props.eventBus.emit('activeDimensions', updatedDimensions);
      this.setState({ dimensions: updatedDimensions });
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'setHiddenColumns',
    value: function setHiddenColumns(hidden) {
      this.props.eventBus.emit('hiddenColumns', hidden);
      this.setState({ hiddenColumns: hidden });
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'setSort',
    value: function setSort(cTitle) {
      var sortBy = this.state.sortBy;
      var sortDir = this.state.sortDir;
      if (sortBy === cTitle) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = cTitle;
        sortDir = 'asc';
      }

      this.props.eventBus.emit('sortBy', sortBy);
      this.props.eventBus.emit('sortDir', sortDir);
      this.setState({ sortBy: sortBy, sortDir: sortDir });
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'setSolo',
    value: function setSolo(solo) {
      var newSolo = this.state.solo;
      newSolo[solo.title] = solo.value;
      this.props.eventBus.emit('solo', newSolo);
      this.setState({ solo: newSolo });
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'clearSolo',
    value: function clearSolo(title) {
      var oldSolo = this.state.solo;
      var newSolo = {};
      Object.keys(oldSolo).forEach(function (k) {
        if (k !== title) newSolo[k] = oldSolo[k];
      });
      this.props.eventBus.emit('solo', newSolo);
      this.setState({ solo: newSolo });
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'hideColumn',
    value: function hideColumn(cTitle) {
      var hidden = this.state.hiddenColumns.concat([cTitle]);
      this.setHiddenColumns(hidden);
      setTimeout(this.updateRows, 0);
    }
  }, {
    key: 'downloadCSV',
    value: function downloadCSV(rows) {
      var self = this;

      var columns = this.getColumns();

      var csv = _.map(columns, 'title').map(JSON.stringify.bind(JSON)).join(',') + '\n';

      var maxLevel = this.state.dimensions.length - 1;
      var excludeSummary = this.props.excludeSummaryFromExport;

      rows.forEach(function (row) {
        if (excludeSummary && row._level < maxLevel) return;

        var vals = columns.map(function (col) {

          if (col.type === 'dimension') {
            var val = row[col.title];
          } else {
            var val = getValue(col, row);
          }

          if (col.template && self.props.csvTemplateFormat) {
            val = col.template(val);
          }

          return JSON.stringify(val);
        });
        csv += vals.join(',') + '\n';
      });
    }

    //download(csv, this.props.csvDownloadFileName, 'text/csv')

  }, {
    key: 'render',
    value: function render() {
      var self = this;
      return React.createElement(
        'div',
        { className: 'reactPivot' },
        this.props.hideDimensionFilter ? '' : React.createElement(Dimensions, {
          dimensions: this.props.dimensions,
          selectedDimensions: this.state.dimensions,
          onChange: this.setDimensions }),
        React.createElement(ColumnControl, {
          hiddenColumns: this.state.hiddenColumns,
          onChange: this.setHiddenColumns }),
        React.createElement(
          'div',
          { className: 'reactPivot-csvExport' },
          React.createElement(
            'button',
            { onClick: partial(this.downloadCSV, this.state.rows) },
            'Export CSV'
          )
        ),
        Object.keys(this.state.solo).map(function (title) {
          var value = self.state.solo[title];

          return React.createElement(
            'div',
            {
              style: { clear: 'both' },
              className: 'reactPivot-soloDisplay',
              key: 'solo-' + title },
            React.createElement(
              'span',
              {
                className: 'reactPivot-clearSolo',
                onClick: partial(self.clearSolo, title) },
              '\xD7'
            ),
            title,
            ': ',
            value
          );
        }),
        React.createElement(PivotTable, {
          columns: this.getColumns(),
          rows: this.state.rows,
          sortBy: this.state.sortBy,
          sortDir: this.state.sortDir,
          onSort: this.setSort,
          onColumnHide: this.hideColumn,
          nPaginateRows: this.props.nPaginateRows,
          onSolo: this.setSolo })
      );
    }
  }]);

  return ReactPivot;
}(React.Component);

ReactPivot.defaultProps = {
  rows: [],
  dimensions: [],
  activeDimensions: [],
  reduce: function reduce() {},
  tableClassName: '',
  csvDownloadFileName: 'table.csv',
  csvTemplateFormat: false,
  defaultStyles: true,
  nPaginateRows: 25,
  solo: {},
  hiddenColumns: [],
  sortBy: null,
  sortDir: 'asc',
  eventBus: new Emitter(),
  compact: false,
  excludeSummaryFromExport: false,
  onData: function onData() {}
};

module.exports = ReactPivot;