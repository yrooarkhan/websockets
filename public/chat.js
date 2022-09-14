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

const usernameDiv = document.getElementById('username');
usernameDiv.innerHTML = `Olá ${username} - Você está na sala <strong>${room}</strong>.`;

document.getElementById('logout').addEventListener('click', () => {
  window.location.href = 'index.html';
});

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

document.getElementById('message_input').addEventListener('keypress', (event) => {
  const message = event.target.value;

  if (event.key === 'Enter' && !!message) {
    socket.emit('message', { room, username, message });
    event.target.value = '';
  }
});

const createMessage = ({ username, text, createdAt }) => {
  const formatedDate = Intl.DateTimeFormat('pt-BR', formatOptions).format(new Date(createdAt));

  return `
    <div class="new_message">
      <label class="form-label">
          <strong>${username}</strong> <span> ${text} - ${formatedDate}</span>
      </label>
    </div>
  `;
};
