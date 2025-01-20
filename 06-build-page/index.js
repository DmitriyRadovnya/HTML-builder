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

let template = '';
const templatePath = path.join(__dirname, "template.html"); //  не собраный макет
const componentsDir = path.join(__dirname, "components"); //  папка с компонентами source
const htmlPath = path.join(dirPath, "index.html");


function createLayout(doctype, source, targetHtml) {
    fs.readFile(doctype, "utf-8", (err, data) => {
        if (err) throw err;
        template = data;
    })
    
    fs.readdir(source, (dirErr, dirFiles) => {
        if (dirErr) throw dirErr;
        let componentsCount = 0;
    
        dirFiles.forEach(component => {
            const componentPath = path.join(source, component);
    
            fs.stat(componentPath, (err, compStats) => {
                const compName = path.parse(component).name.trim();

                if (compStats.isFile()) {

                    fs.readFile(componentPath, "utf-8", (errData, compData) => {
                        if (errData) throw errData;
                        template = template.replace(`{{${compName}}}`, compData);
                        componentsCount++;

                        if (componentsCount === dirFiles.length) {
                            
                            fs.writeFile(targetHtml, template, (err) => {
                                if (err) throw err;
                            })
                        }
                    });
                } else {
                    componentsCount++;
                }
            });
        });
    });
};

createLayout(templatePath, componentsDir, htmlPath);