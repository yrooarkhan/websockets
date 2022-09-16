import { Server, Socket } from 'socket.io';
import { messages, users } from '../database/tempDatabase';
import logger from './loggerService';
import Message from '../database/models/Message';
import RoomUser from '../database/models/RoomUser';

import {
  ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS,
  ERRO_ESTABELECIMENTO_DE_CONEXAO,
  ERRO_REMOCAO_USUARIO_SALA,
} from './errors';

const connectUserToRoom = (io: Server, socket: Socket) => {
  return (user: RoomUser, callback: (messagesInRoom: Message[]) => void) => {
    try {
      socket.join(user.room);

      const userInRoom: RoomUser = users.find(
        (userInList) => userInList.username === user.username && userInList.room === user.room
      );

      if (userInRoom) {
        logger.info(`Usuário "${user.username}" teve o socket id atualizado.`);
        userInRoom.socket_id = socket.id;
      } else {
        logger.info(`Usuário "${user.username}" conectado na sala "${user.room}".`);
        user.socket_id = socket.id;
        users.push(user);
      }

      const usersConnectedInRoom: number = users.filter(
        (userInList) => userInList.room === user.room
      ).length;

      io.to(user.room).emit('update_users_connected', usersConnectedInRoom);
      callback(getMessagesRoom(user.room));
    } catch (errorStack) {
      socket.disconnect();
      logger.error(ERRO_ESTABELECIMENTO_DE_CONEXAO, errorStack);
    }
  };
};

const removeUserFromRoom = (io: Server, socket: Socket) => {
  return () => {
    try {
      const user: RoomUser = users.find((userInList) => userInList.socket_id === socket.id);

      if (user) {
        users.splice(users.indexOf(user), 1);
        logger.info(`Usuário "${user.username}" desconectado da sala "${user.room}".`);

        const usersConnectedInRoom: number = !user
          ? 0
          : users.filter((userInList) => userInList.room === user.room).length;

        io.to(user.room).emit('update_users_connected', usersConnectedInRoom);
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
      logger.info(
        `Usuário "${message.username}" enviou "${message.room}", na sala "${message.text}".`
      );
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
