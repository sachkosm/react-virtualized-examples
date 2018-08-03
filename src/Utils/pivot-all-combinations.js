/**
* Given a set of sets, this function will return all the combinations
* of those sets. For instance, say a shirt comes in sizes S, M, and L,
* and colors Black and White, and can be labeled with either Mom or Dad,
* this will return an array of arrays with the following:
* {
* {S, Black, Mom}
* {S, Black, Dad}
* {S, White, Mom}
* {S, White, Dad}
* {M, Black, Mom}
* …
* }
* The function can accept any number of sets to combine.
*/
function pivot(array) {
  if (array.length == 1) {
    var bottom = new Array();
    for (var i = 0; i < array[0].length; i++) {
      bottom.push(new Array(array[0][i].toString()));
    }
    return bottom;
  } else {
    var myPivot = pivot(array.slice(1));
    var newArray = new Array();
    for (var i = 0; i < array[0].length; i++) {
      for (var j = 0; j < myPivot.length; j++) {
        var tempArray = myPivot[j].slice();
        tempArray.unshift(array[0][i].toString());
        newArray.push(tempArray);
      }
    }
    return newArray;
  }
}

var arr = Array(13)
  .fill()
  .map((val, idx) => {
    return new Array(
      idx,
      Math.floor(Math.random() * 25) + 1,
      Math.floor(Math.random() * 600) + 1
    );
  });
var pivotArr = pivot(arr);
console.log(pivotArr)
//export default pivotArr;
