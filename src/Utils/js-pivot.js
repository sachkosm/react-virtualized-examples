//https://techbrij.com/convert-column-to-row-javascript-array-pivot

function getPivotArray(dataArray, rowIndex, colIndex, dataIndex) {
    //Code from https://techbrij.com
    var result = {}, ret = [];
    var newCols = [];
    for (var i = 0; i < dataArray.length; i++) {

        if (!result[dataArray[i][rowIndex]]) {
            result[dataArray[i][rowIndex]] = {};
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];
        }else{
            //Sum
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = result[dataArray[i][rowIndex]][dataArray[i][colIndex]] +  dataArray[i][dataIndex];
        }
        

        //To get column names
        if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
            newCols.push(dataArray[i][colIndex]);
        }
    }

    newCols.sort();
    var item = [];

    //Add Header Row
    item.push('Item');
    item.push.apply(item, newCols);
    ret.push(item);
console.log(result)
    //Add content 
    for (var key in result) {
        item = [];
        item.push(key);
        for (var i = 0; i < newCols.length; i++) {
            item.push(result[key][newCols[i]] || "-");
        }
        ret.push(item);
    }
    return ret;
}

var rowCount = 10;

var arr = Array(rowCount)
    .fill()
    .map((val, idx) => {
        return ([
            // id: idx,
            Math.random()
                .toString(36)
                .substring(10),
            Math.floor(Math.random() * 600) + 1,
            Math.floor(Math.random() * 3) + 1
        ]);
    });

var doubleArray = arr.concat(arr)
console.log(doubleArray);
console.log(getPivotArray(doubleArray, 0, 2, 1));