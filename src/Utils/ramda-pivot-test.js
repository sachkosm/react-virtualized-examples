const R = require('ramda')

const pivotWith = R.curry((fn, keyCol, valCol, table) => R.pipe(
    R.groupWith(R.eqBy(R.omit([keyCol, valCol]))),
    R.map((rowGroup) => R.reduce(
        R.mergeWith(fn),
        R.omit([keyCol, valCol], rowGroup[0]),
        rowGroup.map((row) => ({ [row[keyCol]]: row[valCol] }))
    )),
)(table))

const pivot = pivotWith(R.nthArg(0))

// //usage:
// var result = pivot("attribute", "value", [  
//   { key: "key1", attribute: "attribute1", value: 1 },  
//   { key: "key1", attribute: "attribute3", value: 3 },  
//   { key: "key2", attribute: "attribute1", value: 2 },  
//   { key: "key2", attribute: "attribute2", value: 4 },
// ])
// // result:
// // [{ key: key1, attribute1: 1, attribute3: 3 },
// //  { key: key2, attribute1: 2, attribute2: 4 }]


var rowCount = 10;
var arr = Array(rowCount)
    .fill()
    .map((val, idx) => {
        return {
           // id: idx,
            stock: Math.random()
                .toString(36)
                .substring(10),
            tradePrice: Math.floor(Math.random() * 600) + 1,
            year: Math.floor(Math.random() * 3) + 1
        };
    });
console.log(arr);
console.log(pivot("stock", "tradePrice", arr));
