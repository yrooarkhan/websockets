import { Server } from 'socket.io';

import {
  broadcastMessageToUsersInTheSameRoom,
  connectUserToRoom,
  removeUserFromRoom,
} from '../services/roomService';

const initWebsocket = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('select_room', connectUserToRoom(io, socket));
    socket.on('message', broadcastMessageToUsersInTheSameRoom(io));
    socket.on('disconnect', removeUserFromRoom(io, socket));
  });
};

export default initWebsocket;
