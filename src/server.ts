import { serverHttp } from './http';
import logger from './logger';
import './websocket';

serverHttp.listen(3000, () => logger.info('Server is running on PORT 3000.'));
