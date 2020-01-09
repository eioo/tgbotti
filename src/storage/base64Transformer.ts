import { ValueTransformer } from 'typeorm';

export const base64Transformer: ValueTransformer = {
  from: val => Buffer.from(val, 'base64').toString('ascii'),
  to: val => Buffer.from(val).toString('base64'),
};
