const users = [];

// Join user to chat
function newUser(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

// Get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers() {
    return users;
  }

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getRoomUsers
};