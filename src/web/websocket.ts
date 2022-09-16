import { Server } from 'socket.io';

import {
  broadcastMessageToUsersInTheSameRoom,
  connectUserToRoom,
  removeUserFromRoom,
} from '../services/roomService';

const initWebsocket = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('select_room', connectUserToRoom(socket));
    socket.on('message', broadcastMessageToUsersInTheSameRoom(io));
    socket.on('disconnect', removeUserFromRoom(socket));
  });
};

export default initWebsocket;
