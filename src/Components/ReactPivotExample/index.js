import React, { Component } from 'react';
import ReactPivot from '../../Components/ReactPivotR16Src';
// import rows from './data.json'
// import loremIpsum from 'lorem-ipsum';
import data from './test-data.js'

class ReactPivotExample extends Component {

    constructor(props, context) {
        super(props)

        // These are your "groups"
        // "title" is the title of the column
        // all rows with the same "value" will be grouped
        this.dimensions = [
            { value: 'firstName', title: 'First Name' },
            { value: 'lastName', title: 'Last Name' },
            { value: 'state', title: 'State' },
            {
                value: function (row) {
                    return row.transaction.business
                }, title: 'Business'
            },
            {
                value: function (row) {
                    return row.transaction.type
                }, title: 'Transaction Type'
            }]

        // All rows will be run through the "reduce" function
        // Use this to build up a "memo" object with properties you're interested in
        this.reduce = function (row, memo) {
            // the memo object starts as {} for each group, build it up
            memo.count = (memo.count || 0) + 1
            memo.amountTotal = (memo.amountTotal || 0) + parseFloat(row.transaction.amount)
            // be sure to return it when you're done for the next pass
            return memo
        }

        // Calculations are columns for the "memo" object built up above
        // "title" is the title of the column
        this.calculations = [
            {
                title: 'Count',
                value: 'count',
                className: 'alignRight'
            },
            {
                title: 'Amount',
                value: 'amountTotal',
                template: function (val, row) {
                    return '$' + val.toFixed(2)
                },
                className: 'alignRight'
            },
            {
                title: 'Avg Amount',
                value: function (row) {
                    return row.amountTotal / row.count
                },
                template: function (val, row) {
                    return '$' + val.toFixed(2)
                },
                className: 'alignRight'
            }
        ]
    }


    render() {
        var rows = data(500000)
        return (
            <div>
                <ReactPivot rows={rows}
                    rows={rows}
                    dimensions={this.dimensions}
                    calculations={this.calculations}
                    reduce={this.reduce}
                    activeDimensions={['Transaction Type']}
                    nPaginateRows={100} />
            </div>
        )
    }
}
export default ReactPivotExample;