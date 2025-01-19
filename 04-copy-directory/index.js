const fs = require("fs");
const path = require("path");

const newDirPath = path.join(__dirname, "files-copy"); // Генерация пути новой директории

fs.mkdir(newDirPath, {recursive: true}, (err) => { // Создание новой директории
    if (err) throw err;
});

const source = path.join(__dirname, "files"); // Путь к исходной директории

fs.readdir(source, (err, filesArr) => { // Получение массива файлов исходной директории
    if (err) throw err;

    filesArr.forEach(file => {
        const filePath = path.join(source, `${file}`); // Путь к исходному файлу

        fs.stat(filePath, (fileErr) => { // Получение объекта с информацией о файле
            if(fileErr) throw fileErr;

            const fileBaseName = path.parse(file).base; // Получаем путь к файлу с расширением
            const targetPath = path.join(`${newDirPath}`, `${fileBaseName}`); // Путь к новой директории и новому файлу

            fs.copyFile(filePath, targetPath, (copyErr) => { // Копирование
                if (copyErr) throw copyErr;
            });
        });
    });
});