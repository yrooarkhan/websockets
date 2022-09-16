const socket = io();

const formatOptions = {
  month: '2-digit',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get('username');
const room = urlSearch.get('select_room');

const usernameDiv = document.getElementById('username_label');
usernameDiv.innerHTML = `Olá <strong>${username}</strong>, você está na sala <strong>${room}</strong>.`;

socket.emit('select_room', { username, room }, (roomMessages) => {
  const messageDiv = document.getElementById('messages');
  roomMessages.forEach((message) => {
    messageDiv.innerHTML += createMessage({ ...message });
  });
});

socket.on('message', ({ username, text, createdAt }) => {
  const messageDiv = document.getElementById('messages');
  messageDiv.innerHTML += createMessage({ username, text, createdAt });
});

document.getElementById('logout').addEventListener('click', () => {
  window.location.href = `index.html?username=${username}`;
});

document.getElementById('message_button').addEventListener('click', (event) => emitMessage(event));

document.getElementById('message_input').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    emitMessage(event);
  }
});

const emitMessage = (event) => {
  const messageInput = document.getElementById('message_input');
  const message = messageInput.value.trim();

  if (!!message) {
    socket.emit('message', { room, username, message }, () => {
      messageInput.value = '';
      const messages = document.getElementById('messages');
      messages.scroll({ top: messages.scrollHeight, left: 0, behavior: 'smooth' });
    });
  }
};

const createMessage = ({ username, text, createdAt }) => {
  const formatedDate = Intl.DateTimeFormat('pt-BR', formatOptions).format(new Date(createdAt));

  return `
    <div class="message">
      <span>
        <label class="message-emitter">
          ${username}
        </label>

        <label class="message-date">
          ${formatedDate}
        </label>
      </span>

      <label class="message-text">
        ${text}
      <label>
    </div>
  `;
};
