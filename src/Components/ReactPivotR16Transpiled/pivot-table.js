'use strict';

var _ = { range: require('lodash/range') };
var React = require('react');
var createReactClass = require('create-react-class');
var partial = require('./partial');
var getValue = require('./get-value');

module.exports = createReactClass({
  displayName: 'exports',


  getDefaultProps: function getDefaultProps() {
    return {
      columns: [],
      rows: [],
      sortBy: null,
      sortDir: 'asc',
      onSort: function onSort() {},
      onSolo: function onSolo() {},
      onColumnHide: function onColumnHide() {}
    };
  },

  getInitialState: function getInitialState() {
    return {
      paginatePage: 0
    };
  },

  render: function render() {
    var results = this.props.rows;

    var paginatedResults = this.paginate(results);

    var tBody = this.renderTableBody(this.props.columns, paginatedResults.rows);
    var tHead = this.renderTableHead(this.props.columns);

    return React.createElement(
      'div',
      { className: 'reactPivot-results' },
      React.createElement(
        'table',
        { className: this.props.tableClassName },
        tHead,
        tBody
      ),
      this.renderPagination(paginatedResults)
    );
  },

  renderTableHead: function renderTableHead(columns) {
    var self = this;
    var sortBy = this.props.sortBy;
    var sortDir = this.props.sortDir;

    return React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        columns.map(function (col) {
          var className = col.className;
          if (col.title === sortBy) className += ' ' + sortDir;

          var hide = '';
          if (col.type !== 'dimension') hide = React.createElement(
            'span',
            { className: 'reactPivot-hideColumn',
              onClick: partial(self.props.onColumnHide, col.title) },
            '\xD7'
          );

          return React.createElement(
            'th',
            { className: className,
              onClick: partial(self.props.onSort, col.title),
              style: { cursor: 'pointer' },
              key: col.title },
            hide,
            col.title
          );
        })
      )
    );
  },

  renderTableBody: function renderTableBody(columns, rows) {
    var self = this;

    return React.createElement(
      'tbody',
      null,
      rows.map(function (row) {
        return React.createElement(
          'tr',
          { key: row._key, className: "reactPivot-level-" + row._level },
          columns.map(function (col, i) {
            if (i < row._level) return React.createElement('td', { key: i, className: 'reactPivot-indent' });

            return self.renderCell(col, row);
          })
        );
      })
    );
  },

  renderCell: function renderCell(col, row) {
    if (col.type === 'dimension') {
      var val = row[col.title];
      var text = val;
      var dimensionExists = typeof val !== 'undefined';
      if (col.template && dimensionExists) text = col.template(val, row);
    } else {
      var val = getValue(col, row);
      var text = val;
      if (col.template) text = col.template(val, row);
    }

    if (dimensionExists) {
      var solo = React.createElement(
        'span',
        { className: 'reactPivot-solo' },
        React.createElement(
          'a',
          { style: { cursor: 'pointer' },
            onClick: partial(this.props.onSolo, {
              title: col.title,
              value: val
            }) },
          'solo'
        )
      );
    }

    return React.createElement(
      'td',
      { className: col.className,
        key: [col.title, row.key].join('\xff'),
        title: col.title },
      React.createElement('span', { dangerouslySetInnerHTML: { __html: text || '' } }),
      ' ',
      solo
    );
  },

  renderPagination: function renderPagination(pagination) {
    var self = this;
    var nPaginatePages = pagination.nPages;
    var paginatePage = pagination.curPage;

    if (nPaginatePages === 1) return '';

    return React.createElement(
      'div',
      { className: 'reactPivot-paginate' },
      _.range(0, nPaginatePages).map(function (n) {
        var c = 'reactPivot-pageNumber';
        if (n === paginatePage) c += ' is-selected';
        return React.createElement(
          'span',
          { className: c, key: n },
          React.createElement(
            'a',
            { onClick: partial(self.setPaginatePage, n) },
            n + 1
          )
        );
      })
    );
  },

  paginate: function paginate(results) {
    if (results.length <= 0) return { rows: results, nPages: 1, curPage: 0 };

    var paginatePage = this.state.paginatePage;
    var nPaginateRows = this.props.nPaginateRows;
    if (!nPaginateRows || !isFinite(nPaginateRows)) nPaginateRows = results.length;

    var nPaginatePages = Math.ceil(results.length / nPaginateRows);
    if (paginatePage >= nPaginatePages) paginatePage = nPaginatePages - 1;

    var iBoundaryRow = paginatePage * nPaginateRows;

    var boundaryLevel = results[iBoundaryRow]._level;
    var parentRows = [];
    if (boundaryLevel > 0) {
      for (var i = iBoundaryRow - 1; i >= 0; i--) {
        if (results[i]._level < boundaryLevel) {
          parentRows.unshift(results[i]);
          boundaryLevel = results[i]._level;
        }
        if (results[i._level === 9]) break;
      }
    }

    var iEnd = iBoundaryRow + nPaginateRows;
    var rows = parentRows.concat(results.slice(iBoundaryRow, iEnd));

    return { rows: rows, nPages: nPaginatePages, curPage: paginatePage };
  },

  setPaginatePage: function setPaginatePage(nPage) {
    this.setState({ paginatePage: nPage });
  }
});