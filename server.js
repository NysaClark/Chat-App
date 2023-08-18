var app = require("http").createServer(handler),
  io = require("socket.io")(app),
  static = require("node-static"); // for serving files

// This will make all the files in the current folder
// accessible from the web
var fileServer = new static.Server("./public");

const {
  getActiveUser,
  exitRoom,
  newUser,
  getRoomUsers
} = require('./utils/users');

// If the URL of the socket server is opened in a browser
function handler(request, response) {
  request
    .addListener("end", function () {
      fileServer.serve(request, response); // this will return the correct file
    })
    .resume();
}

// Listen for incoming connections from clients
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username }) => {
    const user = newUser(socket.id, username);

    socket.join("Room 1");

    // General welcome
    socket.emit(
      "message",
      {username: "Chat", text: "Messages are limited to this room!"}
    );

    // Broadcast everytime users connects
    socket.broadcast
      .to("Room 1")
      .emit(
        "message",
        {username: "Chat", text: `${user.username} has joined the room`}
      );

    // Current active users and room name
    io.to("Room 1").emit("roomUsers", {
      room: "Room 1",
      users: getRoomUsers(),
    });

    // Listen for client message
    socket.on("chatMessage", (msg) => {
      const user = getActiveUser(socket.id);
      io.to("Room 1").emit("message", {username: user.username, text: msg});
    });
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to("Room 1").emit(
        "message",
        {username: "Chat", text:`${user.username} has left the room`}
      );

      // Current active users and room name
      io.to("Room 1").emit("roomUsers", {
        room: "Room 1",
        users: getRoomUsers(),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});