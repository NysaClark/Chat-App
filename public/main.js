const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const userList = document.getElementById("users");

// get username from URL
var username = location.search.split('username=')[1]

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username });

socket.on("roomUsers", ({ users }) => {
  outputUsers(users);
});

socket.on("message", (message) => {
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  div.appendChild(p);

  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);

  document.querySelector(".chat-messages").appendChild(div);
}

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");

  if (leaveRoom) {
    window.location = "../index.html";
  }
});
