import { Server, Socket } from 'socket.io';
import logger from './loggerService';
import Message from '../database/models/Message';
import RoomUser from '../database/models/RoomUser';

import {
  countUsersInRoom,
  findMessagesFromRoom,
  findUserBySocketId,
  removeUserFromItsRoom,
  persistUser,
  persistMessage,
} from '../database/tempDatabase';

import {
  ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS,
  ERRO_ESTABELECIMENTO_DE_CONEXAO,
  ERRO_REMOCAO_USUARIO_SALA,
} from './errors';

const connectUserToRoom = (io: Server, socket: Socket) => {
  return (user: RoomUser, callback: (messagesInRoom: Message[]) => void) => {
    try {
      socket.join(user.room);
      user.socket_id = socket.id;

      persistUser(user);
      broadcastTotalUsersConnectedInRoom(io, user.room);
      callback(findMessagesFromRoom(user.room));
    } catch (errorStack) {
      socket.disconnect();
      logger.error(ERRO_ESTABELECIMENTO_DE_CONEXAO, errorStack);
    }
  };
};

const removeUserFromRoom = (io: Server, socket: Socket) => {
  return () => {
    try {
      const user: RoomUser = findUserBySocketId(socket.id);

      if (user) {
        removeUserFromItsRoom(user);
        broadcastTotalUsersConnectedInRoom(io, user.room);
      }
    } catch (errorStack) {
      logger.error(ERRO_REMOCAO_USUARIO_SALA, errorStack);
    }
  };
};

const persistUserMessage = (io: Server) => {
  return (message: Message, callback: () => void) => {
    try {
      message.createdAt = new Date();
      persistMessage(message);
      broadcastMessageToUsersInTheSameRoom(io, message);
      callback();
    } catch (errorStack) {
      logger.error(ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS, errorStack);
    }
  };
};

const broadcastMessageToUsersInTheSameRoom = (io: Server, message: Message) => {
  io.to(message.room).emit('message', message);
};

const broadcastTotalUsersConnectedInRoom = (io: Server, room: string) => {
  io.to(room).emit('update_users_connected', countUsersInRoom(room));
};

export { connectUserToRoom, removeUserFromRoom, persistUserMessage };
