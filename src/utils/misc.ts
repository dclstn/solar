/* eslint-disable import/prefer-default-export */
import crypto from 'crypto';

export function secureMathRandom() {
  return crypto.randomBytes(4).readUInt32LE() / 0xffffffff;
}
