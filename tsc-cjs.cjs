#!/usr/bin/env node
const cp = require('child_process');
const fs = require('node:fs');

cp.exec('npx tsc -p tsconfig.cjs.json');

const dirDist = './dist';
const dirDistCjs = './dist/cjs';

if (!fs.existsSync(dirDist)) fs.mkdirSync(dirDist);
if (!fs.existsSync(dirDistCjs)) fs.mkdirSync(dirDistCjs);

fs.writeFileSync('./dist/cjs/package.json', `{"type": "commonjs"}`);
