/* eslint-disable import/prefer-default-export */
import crypto from 'crypto';

export function secureMathRandom() {
  return crypto.randomBytes(4).readUInt32LE() / 0xffffffff;
}

export function sleep() {
  return (ms) =>
    new Promise((r) => {
      setTimeout(r, ms);
    });
}
