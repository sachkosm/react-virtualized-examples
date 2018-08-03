//Generate random dataSource
var rowCount = 10;
exports.arr = Array(rowCount)
  .fill()
  .map((val, idx) => {
    return {
      id: idx,
      name: Math.random()
        .toString(36)
        .substring(26),
      tradePrice: Math.floor(Math.random() * 600) + 1,
      year: Math.floor(Math.random() * 15) + 1
    };
  });
