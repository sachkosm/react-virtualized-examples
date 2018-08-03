function generateRandomData(numberOfRecords) {
    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    //randomDate(new Date(2012, 0, 1), new Date()

    var list = Array(numberOfRecords).fill().map((val, idx) => {
        return {
            "firstName": Math.random()
                .toString(36)
                .substring(10),
            "lastName": Math.random()
                .toString(36)
                .substring(11),
            "state": Math.random()
                .toString(36)
                .substring(10),
            "transaction": {
                "amount": Math.floor(Math.random() * 600) + 1,
                "date": randomDate(new Date(2012, 0, 1), new Date()),
                "business": Math.random()
                    .toString(36)
                    .substring(10),
                "name": Math.random()
                    .toString(36)
                    .substring(10),
                "type": Math.random()
                    .toString(36)
                    .substring(10),
                "account": Math.floor(Math.random() * 600) + 1
            }
        }
    })
    return list;
}
//console.log(generateRandomData(10))
export default generateRandomData;
