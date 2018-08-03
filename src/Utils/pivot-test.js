var Data = require("./data.js");

// takes array of objects
// return objects grouped by rows and pivot
function pivot(arr, rowDimensions, measures, colDimensions, calc) {
  var rows = {};
  var rowNumber = 0;
  var colNumber = 0;
  for (let i = 0; i < arr.length; i++) {
    //If we see the row valuew for first timeout
    //Add new row to rows
    //Put initial value
    if (rows[arr[i][rowDimensions]] === undefined) {
      let o = {};
      o[colDimensions + "_" + arr[i][colDimensions]] = [
        arr[i][measures],
        arr[i][measures],
        1
      ];
      rows[arr[i][rowDimensions]] = o;
      rowNumber++;
    } else {
      //If row exist but year does not - then add year
      //Set the value to initial value
      if (rows[arr[i][rowDimensions]][colDimensions + "_" + arr[i][colDimensions]] === undefined) {
        rows[arr[i][rowDimensions]][colDimensions + "_" + arr[i][colDimensions]] = [
          arr[i][measures],
          arr[i][measures],
          1
        ];
        if (colNumber < Object.keys(rows[arr[i][rowDimensions]]).length) {
          colNumber = Object.keys(rows[arr[i][rowDimensions]]).length;
        }
      } else {
        //If row exists and year exists
        //Recalculate the new avg using exisitng valus and set it to the new value
        let curVal = rows[arr[i][rowDimensions]][colDimensions + "_" + arr[i][colDimensions]][0];
        let newVal = 0;
        let sum = 0;
        let currentCount = rows[arr[i][rowDimensions]][colDimensions + "_" + arr[i][colDimensions]][2];
        if (calc === "avg") {
          sum = curVal + arr[i][measures];
          currentCount++;
          newVal = sum / currentCount; //calculate average
        } else if (calc === "sum") {
          currentCount++;
          newVal = curVal + arr[i][measures];
        }
        rows[arr[i][rowDimensions]][colDimensions + "_" + arr[i][colDimensions]] = [newVal, sum, currentCount];
        console.log([newVal, sum, currentCount]); //Value, sum, Number of occurrances
      }
    }
  }
  return {rows: rows, rowNumbers: rowNumber, colNumbers: colNumber};
}

//Input: data: array, rowName: string, measureName: string, dimensioName: string, culculation type: string
//Returns: Object : rows, rowNumbers, colNumbers
var result = pivot(Data.arr, "name", "tradePrice", "year", "avg");

console.log(Data);
console.log(result);
