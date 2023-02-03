const socket = io('http://localhost:3300');
const msgBox = document.getElementById('exampleFormControlTextarea1');
const msgCont = document.getElementById('data-container');
const userList = document.getElementById('online-user-list');
const currentUserDisp = document.getElementById('currentUserDisp');
const siteId = new URL(window.location).searchParams.get('site');
const type = 'admin';
const users = [];
let currentUser = null;
const userMessages = {};
const usrMsgBox = document.getElementById('user-msg-box');

window.addEventListener('load', (e) => {
  usrMsgBox.classList.toggle('invisible');
});

//get old messages from the server
const messages = [];
function getMessages() {
  fetch('http://localhost:3300/api/chat')
    .then((response) => response.json())
    .then((data) => {
      displayMessage(data);
      data.forEach((el) => {
        messages.push(el);
      });
    })
    .catch((err) => console.error(err));
}
getMessages();

//When a user press the enter key,send message.
msgBox.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) {
    sendMessage({
      type: 'admin',
      to: currentUser,
      from: siteId,
      text: e.target.value,
      clientId: socket.id,
      siteId,
    });
    e.target.value = '';
  }
});

//Display messages to the users
function displayMessage(data) {
  let messages = '';
  data.map((message) => {
    messages += ` <li class="bg-primary p-2 rounded mb-2 text-light">
      <span class="fw-bolder">${message.from}</span>
      ${message.text}
    </li>`;
  });
  msgCont.innerHTML = messages;
}

//socket.io
//emit sendMessage event to send message
function sendMessage(message) {
  socket.emit('sendMessage', message);
}

//join connection
socket.emit('join', { siteId, type: 'admin' });
//Listen to newMessage
socket.on('newMessage', (payload) => {
  let userEmail = '';
  if (payload.type == 'user') {
    userEmail = payload.from;
  }

  if (payload.type == 'admin') {
    userEmail = payload.to;
  }

  userMessages[userEmail] = [...(userMessages[userEmail] ?? []), payload];

  if (currentUser == userEmail) {
    console.log(userMessages[userEmail]);
    displayMessage(userMessages[userEmail]);
  }
});

//Listen to client join
socket.on('join', (payload) => {
  console.log('new user join ' + payload.email);
  //add user to list
  users.push(payload.email);
  let list = '';
  users.map((user) => {
    list += `<li class="bg-dark p-2 mt-2 rounded mb-2 text-light cursor-pointer" onclick="showUserMessage(event, '${user}')">${user}</li>`;
  });
  userList.innerHTML = list;
});

function showUserMessage(event, email) {
  console.log(event);
  if (currentUser !== 'email') {
    currentUser = email;
    currentUserDisp.innerText = email;
    displayMessage(userMessages[email] ?? []);
    usrMsgBox.classList.remove('invisible');
  }
}
