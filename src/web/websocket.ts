import { Server } from 'socket.io';

import {
  persistUserMessage,
  connectUserToRoom,
  removeUserFromRoom,
} from '../services/roomService';

const initWebsocket = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('select_room', connectUserToRoom(io, socket));
    socket.on('message', persistUserMessage(io));
    socket.on('disconnect', removeUserFromRoom(io, socket));
  });
};

export default initWebsocket;
