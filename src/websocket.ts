import { SocketAddress } from 'net';
import { io } from './http';
import logger from './logger';

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  text: string;
  createdAt: Date;
  room: string;
  username: string;
}

const users: RoomUser[] = [];
const messages: Message[] = [];

io.on('connection', (socket) => {
  socket.on('select_room', ({ username, room }, callback) => {
    socket.join(room);
    const userInRoom = users.find((user) => user.username === username && user.room === room);

    if (userInRoom) {
      logger.info(`Usuário "${username}" teve o socket id atualizado.`);
      userInRoom.socket_id = socket.id;
    } else {
      logger.info(`Usuário conectado: "${username}". Sala: "${room}"`);
      users.push({
        room,
        username,
        socket_id: socket.id,
      });
    }

    const messagesInRoom = getMessagesRoom(room);
    callback(messagesInRoom);
  });

  socket.on('message', ({ username, room, message: text }) => {
    const message: Message = {
      createdAt: new Date(),
      username,
      text,
      room,
    };

    messages.push(message);
    logger.info(`Usuário ${username} enviou na sala ${room}: ${text}`);
    io.to(room).emit('message', message);
  });

  socket.on('disconnect', () => {
    const user = users.find((user) => user.socket_id === socket.id);

    if (user) {
      users.splice(users.indexOf(user), 1);
      logger.info(`Usuário "${user.username}" desconectado da sala "${user.room}"`);
    }
  });
});

const getMessagesRoom = (room: string) => {
  return messages.filter((message) => message.room === room);
};
