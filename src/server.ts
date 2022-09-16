import logger from './services/loggerService';
import initWebsocket from './web/websocket';

import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
app.use(express.static(path.join(__dirname, '..', 'public')));

const serverHttp = http.createServer(app);
const io = new Server(serverHttp);

initWebsocket(io);

serverHttp.listen(3000, () => logger.info('Server is running on PORT 3000.'));
