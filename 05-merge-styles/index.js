const fs = require("fs");
const path = require("path");

const resultArr = [];

const stylesDirPath = path.join(__dirname, "styles");
const cssBundle = path.join(__dirname, "project-dist", "bundle.css");

fs.writeFile(cssBundle, "", (err) => {
    if (err) throw err;
    console.log("Bundle created");
})

fs.readdir(stylesDirPath, (err, styleDir) => {
    if (err) throw err;
    let fileCount = 0;
    
    styleDir.forEach(style => {
        const stylePath = path.join(stylesDirPath, style);
        
        fs.stat(stylePath, (fileErr) => {
            if (fileErr) throw fileErr;
            const fileExt = path.parse(style).ext;

            if (fileExt === ".css") {
                fileCount++;

                fs.readFile(stylePath, "utf-8", (styleErr, styleData) => {
                    resultArr.push(styleData);
                    
                    if (fileCount === styleDir.length) {
                        const styleBundle = resultArr.join("\n");

                        fs.writeFile(cssBundle, styleBundle, (err) => {
                            if (err) throw err;
                        });
                    }
                });
            } else {
                fileCount++;

                if (fileCount === styleDir.length && resultArr.length === 0) {
                    console.log("No CSS files found");
                }
            }
        });
    });
});