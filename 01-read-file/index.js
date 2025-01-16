const fs = require("fs");
const path = require("path")
const { stdout } = process;

let data = '';

const readableStream = fs.createReadStream(path.join("01-read-file", "text.txt"));
readableStream.on("data", (chunk) => stdout.write(data += chunk));