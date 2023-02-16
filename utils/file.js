const fs = require("fs");
const config = require("../config");

const write = (text, file) => {
  return new Promise((resolve, reject) => {
    let json = JSON.stringify(text);
    fs.writeFile(`${config.file.path}${file}`, json, (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(true);
    });
  });
};

const read = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`${config.file.path}${file}`, "utf-8", (err, json) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(json);
      }
    });
  });
};

module.exports = { write, read };
