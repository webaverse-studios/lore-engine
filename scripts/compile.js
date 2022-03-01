#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const data = fs.readFileSync(path.join(__dirname, '../specification/webaverse-script.md'), 'utf8');
const j = {
  prompt: '',
  completion: data,
};

const lines = [
  j,
];

const ws = fs.createWriteStream(path.join(__dirname, '../fine-tune.json'));
for (const line of lines) {
  ws.write(JSON.stringify(line));
  ws.write('\n');
}
ws.end();