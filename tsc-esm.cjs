#!/usr/bin/env node
const cp = require('child_process');
const fs = require('node:fs');

cp.exec('npx tsc -p tsconfig.esm.json');

const dirDist = './dist';
const dirDistEsm = './dist/esm';

if (!fs.existsSync(dirDist)) fs.mkdirSync(dirDist);
if (!fs.existsSync(dirDistEsm)) fs.mkdirSync(dirDistEsm);
fs.writeFileSync('./dist/esm/package.json', `{"type": "module"}`);
