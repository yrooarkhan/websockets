import logger from '../services/loggerService';
import Message from './models/Message';
import RoomUser from './models/RoomUser';

const users: RoomUser[] = [];
const messages: Message[] = [];

const findUserBySocketId = (socket_id: string) => {
  return users.find((userInList) => userInList.socket_id === socket_id);
};

const findMessagesFromRoom = (room: string) => {
  return messages.filter((message) => message.room === room);
};

const countUsersInRoom = (room: string) => {
  return users.filter((userInList) => userInList.room === room).length;
};

const removeUserFromItsRoom = (user: RoomUser) => {
  users.splice(users.indexOf(user), 1);
  logger.info(`Usuário "${user.username}" desconectado da sala "${user.room}".`);
};

const persistUser = (user: RoomUser) => {
  users.push(user);
  logger.info(`Usuário "${user.username}" conectado na sala "${user.room}".`);
};

const persistMessage = (message: Message) => {
  messages.push(message);
  
  const { username, room, text } = message;
  logger.info(`Usuário "${username}" enviou "${room}" na sala "${text}".`);
};

export { findUserBySocketId, findMessagesFromRoom, countUsersInRoom, removeUserFromItsRoom, persistUser, persistMessage };
