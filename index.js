const { create } = require('domain');
const { readFile: rf, appendFile: af, readFileSync: rfs, writeFileSync: wfs, appendFileSync } = require('fs');
const dbTextTojson = () => {
  let myData = rfs('db.txt', 'utf-8')
  myData = myData.split("}");
  // console.log(myData)
  myData = myData.map((item, index) => {
    if (index == myData.length - 1) {
      return item
    }
    return item + "}"
  })
  const newArr = []
  for (let i = 0; i < myData.length - 1; i++) {
    newArr.push(myData[i]);
  }
  return newArr;
}
const getTodosSync = () => {
  let data = rfs('db.txt', "utf-8");
  return data;
};
const getTodoSync = (id) => {
  const newArr = dbTextTojson();
  const ans = newArr.map((item) => JSON.parse(item))
  const finalAns = ans.find((item) => item.id == id);
  let myString = JSON.stringify(finalAns);
  return myString;
};
const createTodoSync = (todo) => {
  if (todo == '') {
    return;
  }
  let rawTime = Date.now();
  let dateObject = new Date(rawTime);
  let properTime = dateObject.toISOString();
  let myTodo = {
    id: Date.now(),
    title: todo,
    isCompleted: false,
    createdAt: properTime,
    updatedAt: properTime
  }
  myString = JSON.stringify(myTodo, null, 2);
  const newArr = dbTextTojson();
  const ans = newArr.map((item) => JSON.parse(item));
  if (ans.length != 0) {
    appendFileSync("db.txt", "\n")
    appendFileSync("db.txt", myString);
  } else {
    appendFileSync("db.txt", myString);
  }
};
const updateTodoSync = (id, updates) => {
  let allTodos = dbTextTojson();
  const ans = allTodos.map((item) => JSON.parse(item));
  const finalAns = ans.map((item) => {
    if (item.id == id) {
      let rawTime = Date.now();
      let dateObject = new Date(rawTime);
      let properTime = dateObject.toISOString();
      return { ...item, ...updates, updatedAt: properTime };
    }
    return item; // Return the original item if the ID doesn't match
  });
  wfs("db.txt", "");
  finalAns.forEach((item, index) => {
    let myString = JSON.stringify(item, null, 2);
    appendFileSync("db.txt", (index > 0 ? '\n' : '') + myString);
  });
};
const deleteTodoSync = (id) => {
  let rawData = dbTextTojson();
  let Data = rawData.map((item) => JSON.parse(item));
  let filteredData = Data.filter((item) => item.id !== id);
  wfs("db.txt", "");
  filteredData.map((item, index) => {
    let myString = JSON.stringify(item, null, 2);
    appendFileSync("db.txt", (index > 0 ? '\n' : '') + myString)
  })
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync,
};