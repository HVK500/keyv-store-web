import fs from 'fs';
import path from 'path';

export const pathing = path;
export const createWriteStream = fs.createWriteStream;

// tslint:disable-next-line: no-empty
export const noop = (...params: any) => {};

export const isValueSet = (value: any): boolean => {
  return value != null;
};

export const cleansePath = (path: string): string => {
  // Prevents directory walking
  return path.replace(/\.+[\/\\]/g, '');
};

export const isEmptyObject = (obj: object): boolean => {
  return !Object.keys(obj).length;
};

export const fileExists = (path: string): boolean => {
  return fs.existsSync(path);
};

export const getTimeStamp = (): string => {
  return new Date()
    .toISOString()
    .replace(/T|\:|\./g, '.')
    .replace('Z', '');
};

export const createPath = (path: string): string => {
  const directory = pathing.dirname(path);
  fs.mkdirSync(directory, { recursive: true });
  return path;
};
