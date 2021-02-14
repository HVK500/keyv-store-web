import { WriteStream } from 'fs';
import pino, { Logger } from 'pino';
import pinoHttp, { HttpLogger } from 'pino-http';
import { multistream } from 'pino-multi-stream';
import { createPath, createWriteStream, getTimeStamp, pathing } from '../utils/util';
import { envValue } from '../utils/validate-env';

class LoggerService {
  private isProduction: boolean;
  private basePath: string;
  private level: string;
  private httpInst: HttpLogger;
  private logInst: Logger;

  constructor() {
    this.isProduction = envValue<boolean>('isProduction');
    this.basePath = envValue<string>('LOG_PATH');
    this.level = envValue<string>('LOG_LEVEL');
  }

  get log(): Logger {
    if (!this.logInst) {
      let stream: any = process.stdout;
      if (this.isProduction) {
        stream = multistream([
          { stream: stream },
          { stream: this.getOutputStream('application') }
        ]);
      }

      this.logInst = pino({
        name: 'keyv-store-web:app',
        prettyPrint: {
          translateTime: true,
          levelFirst: true
        },
        level: this.level
      }, stream);
    }

    return this.logInst;
  }

  get httpMiddleware(): HttpLogger {
    if (!this.httpInst) {
      this.httpInst = pinoHttp({
        name: 'keyv-store-web:http',
        prettyPrint: {
          translateTime: true,
          levelFirst: true
        },
        level: this.level
      }, this.getOutputStream('http'));
    }

    return this.httpInst;
  }

  private getOutputStream(name: string): WriteStream {
    return createWriteStream(
      // tslint:disable-next-line: prefer-template
      createPath(pathing.join(pathing.join(this.basePath, name), `${getTimeStamp()}.log`)),
      { flags: 'a' }
    );
  }
}

const inst = new LoggerService();
export const log = inst.log;
export const httpMiddleware = inst.httpMiddleware;
