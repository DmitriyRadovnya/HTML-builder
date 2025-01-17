const {stdin, stdout, exit} = process;
const fs = require("fs");
const path = require("path");

const writeStream = fs.createWriteStream(path.join("02-write-file", "text.txt"));

stdout.write("Write text or 'exit'\n");

stdin.on("data", (data) => {
    const text = data.toString().trim();

    if (text === "exit") {
        stdout.write("Process complete");
        exit();
    }
    
    writeStream.write(data);
})