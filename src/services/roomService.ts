import { Server, Socket } from 'socket.io';
import { messages, users } from '../database/tempDatabase';
import logger from './loggerService';
import Message from '../database/models/Message';
import UnconnectedUser from './dtos/UnconnectedUser';

import {
  ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS,
  ERRO_ESTABELECIMENTO_DE_CONEXAO,
  ERRO_REMOCAO_USUARIO_SALA,
} from './errors';

const connectUserToRoom = (socket: Socket) => {
  return ({ username, room }: UnconnectedUser, callback: (messagesInRoom: Message[]) => void) => {
    try {
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
    } catch (errorStack) {
      socket.disconnect();
      logger.error(ERRO_ESTABELECIMENTO_DE_CONEXAO, errorStack);
    }
  };
};

const removeUserFromRoom = (socket: Socket) => {
  return () => {
    try {
      const user = users.find((user) => user.socket_id === socket.id);

      if (user) {
        users.splice(users.indexOf(user), 1);
        logger.info(`Usuário "${user.username}" desconectado da sala "${user.room}"`);
      }
    } catch (errorStack) {
      logger.error(ERRO_REMOCAO_USUARIO_SALA, errorStack);
    }
  };
};

const broadcastMessageToUsersInTheSameRoom = (io: Server) => {
  return (message: Message, callback: () => void) => {
    try {
      message.createdAt = new Date();
      messages.push(message);
      logger.info(`Usuário ${message.username} enviou na sala ${message.room}: ${message.text}`);
      io.to(message.room).emit('message', message);
      callback();
    } catch (errorStack) {
      logger.error(ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS, errorStack);
    }
  };
};

const getMessagesRoom = (room: string) => {
  return messages.filter((message) => message.room === room);
};

export { connectUserToRoom, removeUserFromRoom, broadcastMessageToUsersInTheSameRoom };
