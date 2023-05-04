const AdmZip = require("adm-zip");
const path = require("path");
const fs = require('fs');
const fsPromises = fs.promises;

async function extractArchive(directory, filepath) {
    try {
      const zip = new AdmZip(filepath);
      zip.extractAllTo(directory, false);
    } catch (e) {
      throw new Error(e.message);
    }
}

async function readOpera(filePath) {
  const paragrafhInBook = [];

  const firstLevelFiles = await fsPromises.readdir(filePath);

  await Promise.all(
    firstLevelFiles.map(async dir => {
      const stat = await fsPromises.lstat(`${filePath}/${dir}`);
      if(stat.isFile()) {
        return;
      }

      const files = await fsPromises.readdir(`${filePath}/${dir}`);

      await Promise.all(files.map(async (file) => {
        const content = await fsPromises.readFile(`${filePath}/${dir}/${file}`, "utf8")
        let split = "\n\n";
        if(content.includes("\r\n\r\n")) {
          split = "\r\n\r\n";
        }

        if(!isNaN(parseInt(path.parse(file).name))) {
          paragrafhInBook.push({
            book: dir,
            chapter: path.parse(file).name,
            contents: content.split(split)
          })
        }
      }))
    })
  )

  return paragrafhInBook;
}

async function readInfoOpera(filePath) {
  const data = await fsPromises.readFile(filePath);
  
  return JSON.parse(data);
}

export {
  extractArchive,
  readOpera,
  readInfoOpera
}