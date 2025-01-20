const fs = require("fs");
const path = require("path");

const dirPath = path.join(__dirname, "project-dist");

const assetsDir = path.join(dirPath, "assets"); // новая папка путь
const sourceAssets = path.join(__dirname, "assets"); // путь исходной папки

fs.mkdir(dirPath, (err) => {  // создание project-dist
    if (err) throw err;
})

function copyDir(source, dest) {
    fs.mkdir(dest, {recursive: true}, (err) => { // Создание новой директории
        if (err) throw err;
    });

    fs.readdir(source, (err, filesArr) => { // Получение массива файлов исходной директории
        if (err) throw err;

        filesArr.forEach(file => {
            const filePath = path.join(source, `${file}`); // Путь к исходному файлу

            fs.stat(filePath, (fileErr, fileObj) => { // Получение объекта с информацией о файле
                if(fileErr) throw fileErr;

                const fileBaseName = path.parse(file).base; // Получаем путь к файлу с расширением
                const targetPath = path.join(`${dest}`, `${fileBaseName}`); // Путь к новой директории и новому файлу
                if (fileObj.isFile()) {
                    fs.copyFile(filePath, targetPath, (copyErr) => { // Копирование
                        if (copyErr) throw copyErr;
                    });
                } else if (fileObj.isDirectory()) {
                    copyDir(path.join(source, file), path.join(dest, file))
                }

            });
        });
    });
}

copyDir(sourceAssets, assetsDir);

const stylesArr = [];
const sourceStyleDir = path.join(__dirname, "styles");
const styleBundle = path.join(dirPath, "style.css");


function cssBundler(sourceDir, targetFile) {
    fs.readdir(sourceDir, (err, files) => {
        if (err) throw err;

        let fileCount = 0;

        fs.writeFile(targetFile, "", (err) => {
            if (err) throw err;
            console.log("+style.css");
        });

        files.forEach(file => {
            const filePath = path.join(sourceDir, file);

            fs.stat(filePath, (fileErr, stats) => {
                if (fileErr) throw fileErr;

                if (stats.isFile()) {
                    const fileExt = path.extname(file);

                    if (fileExt === ".css") {
                        fileCount++;

                        fs.readFile(filePath, "utf-8", (styleErr, styleData) => {
                            if (styleErr) throw styleErr;
                            stylesArr.push(styleData);

                            if (fileCount === stylesArr.length) {
                                const styleString = stylesArr.join("\n");
                                fs.writeFile(targetFile, styleString, (writeErr) => {
                                    if (writeErr) throw writeErr;
                                    console.log("Стили записаны в style.css");
                                });
                            }
                        });
                    }
                }
            });
        });
    });
}

cssBundler(sourceStyleDir, styleBundle);
