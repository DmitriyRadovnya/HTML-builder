const fs = require("fs");
const path = require("path");
const {stdout} = process;

const dirPath = path.join(__dirname, "secret-folder");

fs.readdir(dirPath, (err, file) => {
    if (err) stdout.write(`Error: ${err}`);

    file.forEach((child) => {
        const filePath = path.join(dirPath, `${child}`);
        
        fs.stat(filePath, (flErr, fl) => {
            if (flErr) stdout.write(`Error: ${flErr}`);

            if (fl.isFile()) {
                const fileName = path.parse(child).name;
                const fileExt = path.parse(child).ext.slice(1);
                const fileSize = (fl.size / 1024).toFixed(3);

                stdout.write(`${fileName} - ${fileExt} - ${fileSize}kb\n`);
            };
        });
    });
});
