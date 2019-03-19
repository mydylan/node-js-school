import * as zlib from "zlib";
import * as util from "util";
import * as crypto from 'crypto';
import * as stream from "stream";

export const sortedSteps = ['ungzip', 'decrypt', 'upperCase', 'lowerCase', 'removeSpaces', 'encrypt', 'gzip'];

const createTransform = callback => {
    const transform = new stream.Transform();
    transform._transform = callback;
    return transform;
};

const transforms = {
    ungzip: () => zlib.createUnzip(),
    decrypt: () => crypto.createDecipher('aes192', 'password'),
    upperCase: () => createTransform((data, enc, cb) => cb(null, data.toString().toUpperCase())),
    lowerCase: () => createTransform((data, enc, cb) => cb(null, data.toString().toLowerCase())),
    removeSpaces: () => createTransform((data, enc, cb) => cb(null, data.toString().replace(/\s/g, ''))),
    encrypt: () => crypto.createCipher('aes192', 'password'),
    gzip: () => zlib.createGzip(),
};

export const transformFile = async (steps, stream) => (
    steps
        .sort((a, b) => sortedSteps.indexOf(a) - sortedSteps.indexOf(b))
        .reduce((memo, step) => memo.pipe(transforms[step]()), stream)
);
