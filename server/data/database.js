class List {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class User {
  constructor(id, name, address, email, age) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.email = email;
    this.age = age;
  }
}

const userList = new List(1, 'User List');
var users = [
  new User(1, 'Dave', '82 Palm St, NY', 'dave@gmail.com', '75'),
  new User(2, 'Paul', '345 Lafayette St, NY', 'paul@gmail.com', '31'),
  new User(3, 'Carl', '194 W Broadway St, NY', 'carl@gmail.com', '35'),
  new User(4, 'Pete', '164 William St, NY', 'pete@gmail.com', '65'),
  new User(5, 'Joey', '25 Pine St, NY', 'joey@gmail.com', '11'),
  new User(6, 'Bob', '85 Pearl St, NY', 'bob@gmail.com', '13'),
  new User(7, 'Chris', '35, Washington St, NY', 'chris@gmail.com', '54'),
  new User(8, 'Roy', '15 Nassau, NY', 'roy@gmail.com', '82'),
  new User(9, 'Susan', '266 Wooster St, NY', 'susan@gmail.com', '4')
];

/*
* Add users in memory
*/

let curUsers = 9;
function addUser(name, address, email, age) {
  const newUser = new User(curUsers, name, address, email, age);
  users.push(newUser);
  newUser.id = curUsers;
  curUsers += 1;
  return newUser;
}

function updateUser(name, address, email, oldEmail, age) {
  var User = users.find(w => w.email === oldEmail);
  User.name = name;
  User.address = address;
  User.email = email;
  User.age = age;
  return User;
}

function deleteUser(id, email) {
  users = users.filter(function(User) {
    return User.email !== email;
  });
  return { id };
}

function getList(id) {
  return id === userList.id ? userList : null;
}

function getUser(email) {
  return users.find(w => w.email === email);
}

function getUsers() {
  return users;
}

export {
  List,
  User,
  getList,
  getUser,
  getUsers,
  addUser,
  deleteUser,
  updateUser
};
