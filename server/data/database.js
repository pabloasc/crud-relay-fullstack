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
  new User(1, 'Dave', 'Palm Street 45', 'dave@gmail.com', '15'),
  new User(2, 'Paul', 'Palm Street 45', 'paul@gmail.com', '31'),
  new User(3, 'Carl', 'Palm Street 45', 'carl@gmail.com', '35'),
  new User(4, 'Pete', 'Palm Street 45', 'pete@gmail.com', '65'),
  new User(5, 'Joey', 'Palm Street 45', 'joey@gmail.com', '11'),
  new User(6, 'Bob', 'Palm Street 45', 'bob@gmail.com', '13'),
  new User(7, 'Chris', 'Palm Street 45', 'chris@gmail.com', '4'),
  new User(8, 'Roy', 'Palm Street 45', 'roy@gmail.com', '82')
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

function deleteUser(email) {
  users = users.filter(function(User) {
    return User.email !== email;
  });
}

function getList(id) {
  return id === userList.id ? userList : null;
}

function getUser(id) {
  return users.find(w => w.id === id);
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
  deleteUser
};
