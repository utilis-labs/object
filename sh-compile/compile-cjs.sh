#!/bin/bash
npx tsc -p tsconfig.cjs.json
echo '{"type": "commonjs"}' > dist/cjs/package.json
