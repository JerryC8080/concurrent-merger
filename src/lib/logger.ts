import { Logger } from '@jerryc/mini-logger';

export { Level as LoggerLevel } from '@jerryc/mini-logger';

export const logger = new Logger({ prefix: 'single-queue' });
