const fs = require('fs');

const orders = {ASC: "ASC", DESC:"DESC"};

function writeJson(file, data){
  fs.writeFile(file, data, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
}

module.exports.writeJson = writeJson;

function byField(field){
  return (a, b) => a[field] > b[field] ? 1 : -1;
}

function sortArray(array, field, order){
  let result = array;
  result.sort( byField(field) );
  if (order == orders.DESC) result.reverse();
  return result;
}

function sliceArray(array, limit, page){
  let result = array;
  return result.slice((page - 1) * limit, page * limit);
}

function modifyArray(array, field = 'date', order = "DESC", limit = 10, page = 1, includeDeps = false){
  let result = array;
  let pages = 0;

  if (includeDeps === false){
    for (var i = 0; i < result.length; i++) {
      result[i].comments = [];
    }
  }

  result = sortArray(result, field, order);
  result = sliceArray(result, limit, page);

  if (array.length >= limit && (array.length % limit) == 0){
    pages = array.length / limit;
  }else if (array.length >= limit && (array.length % limit) != 0){
    pages = (array.length / limit) + 1;
  }else{
    pages = 1;
  }

  return {items: [result], meta:{page: page, pages: pages, count: array.length, limit:limit}};
}

module.exports.modifyArray = modifyArray;
