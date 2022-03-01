#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const objects = [
  {
    prompt: '',
    path: path.join(__dirname, '../specification/webaverse-lore-file.md'),
  },
].concat(
  fs.readdirSync(path.join(__dirname, '../data/')).map(l => path.join(__dirname, '../data/', l))
    .map(l => {
      return {
        prompt: '',
        path: l,
      };
    })
);

const ws = fs.createWriteStream(path.join(__dirname, '../lore.json'));
for (const o of objects) {
  const {prompt, path} = o;
  const completion = fs.readFileSync(path, 'utf8');
  const j = {
    prompt,
    completion,
  };
  ws.write(JSON.stringify(j));
  ws.write('\n');
}
ws.end();