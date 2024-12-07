#!/bin/bash
npx tsc -p tsconfig.esm.json
echo '{"type": "module"}' > dist/esm/package.json
