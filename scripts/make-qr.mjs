import { writeFileSync } from "node:fs";

const text = "http://192.168.1.7:5173/";
const out = "/Users/takahata/Documents/New project/スマホ用QRコード.svg";
const version = 2;
const size = 21 + (version - 1) * 4;
const dataCodewords = 34;
const ecCodewords = 10;
const modules = Array.from({ length: size }, () => Array(size).fill(false));
const reserved = Array.from({ length: size }, () => Array(size).fill(false));

function setModule(x, y, value, reserve = true) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  modules[y][x] = value;
  if (reserve) reserved[y][x] = true;
}

function drawFinder(x, y) {
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const xx = x + dx;
      const yy = y + dy;
      const inside = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const black = inside && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      setModule(xx, yy, black);
    }
  }
}

function drawAlignment(cx, cy) {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const black = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
      setModule(cx + dx, cy + dy, black);
    }
  }
}

drawFinder(0, 0);
drawFinder(size - 7, 0);
drawFinder(0, size - 7);
drawAlignment(18, 18);

for (let i = 8; i < size - 8; i++) {
  setModule(i, 6, i % 2 === 0);
  setModule(6, i, i % 2 === 0);
}

setModule(8, 4 * version + 9, true);

const formatCoords = [
  [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
  [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8],
  [size - 6, 8], [size - 7, 8], [size - 8, 8], [8, size - 7], [8, size - 6],
  [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
];
for (const [x, y] of formatCoords) reserved[y][x] = true;

const bits = [];
function append(value, length) {
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

const bytes = [...Buffer.from(text, "utf8")];
append(0b0100, 4);
append(bytes.length, 8);
for (const byte of bytes) append(byte, 8);
append(0, Math.min(4, dataCodewords * 8 - bits.length));
while (bits.length % 8) bits.push(0);

const data = [];
for (let i = 0; i < bits.length; i += 8) {
  data.push(bits.slice(i, i + 8).reduce((value, bit) => (value << 1) | bit, 0));
}
for (let pad = 0xec; data.length < dataCodewords; pad = pad === 0xec ? 0x11 : 0xec) data.push(pad);

function gfMul(a, b) {
  let result = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) result ^= a;
    const carry = a & 0x80;
    a = (a << 1) & 0xff;
    if (carry) a ^= 0x1d;
    b >>>= 1;
  }
  return result;
}

function gfPow(x, power) {
  let result = 1;
  for (let i = 0; i < power; i++) result = gfMul(result, x);
  return result;
}

let generator = [1];
for (let i = 0; i < ecCodewords; i++) {
  const next = Array(generator.length + 1).fill(0);
  for (let j = 0; j < generator.length; j++) {
    next[j] ^= gfMul(generator[j], gfPow(2, i));
    next[j + 1] ^= generator[j];
  }
  generator = next;
}

const remainder = Array(ecCodewords).fill(0);
for (const byte of data) {
  const factor = byte ^ remainder.shift();
  remainder.push(0);
  for (let i = 0; i < ecCodewords; i++) remainder[i] ^= gfMul(generator[i], factor);
}

const allBits = [];
for (const byte of [...data, ...remainder]) appendTo(allBits, byte, 8);

function appendTo(target, value, length) {
  for (let i = length - 1; i >= 0; i--) target.push((value >>> i) & 1);
}

let bitIndex = 0;
for (let right = size - 1; right >= 1; right -= 2) {
  if (right === 6) right--;
  for (let vert = 0; vert < size; vert++) {
    const y = ((right + 1) & 2) === 0 ? size - 1 - vert : vert;
    for (let dx = 0; dx < 2; dx++) {
      const x = right - dx;
      if (reserved[y][x]) continue;
      let bit = bitIndex < allBits.length ? allBits[bitIndex++] === 1 : false;
      if ((x + y) % 2 === 0) bit = !bit;
      setModule(x, y, bit, false);
    }
  }
}

const formatBits = 0b111011111000100;
for (let i = 0; i < 15; i++) {
  const value = ((formatBits >>> i) & 1) === 1;
  const [x1, y1] = formatCoords[i];
  const [x2, y2] = formatCoords[i + 15];
  setModule(x1, y1, value);
  setModule(x2, y2, value);
}

const cell = 14;
const quiet = 4;
const qrSize = (size + quiet * 2) * cell;
const labelHeight = 120;
const width = qrSize;
const height = qrSize + labelHeight;
let rects = "";
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (modules[y][x]) {
      rects += `<rect x="${(x + quiet) * cell}" y="${(y + quiet) * cell + labelHeight}" width="${cell}" height="${cell}"/>`;
    }
  }
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="${width / 2}" y="42" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif" font-size="28" font-weight="900" fill="#1d4ed8">道エネSSサービスマスター</text>
  <text x="${width / 2}" y="78" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif" font-size="22" font-weight="800" fill="#f97316">スマホで読み取って開く</text>
  <text x="${width / 2}" y="106" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Hiragino Sans', sans-serif" font-size="22" font-weight="900" fill="#111827">合言葉: 583</text>
  <g fill="#000000" shape-rendering="crispEdges">${rects}</g>
</svg>
`;

writeFileSync(out, svg);
console.log(out);
