// importModules.js
import { promises as fsPromises } from "fs";
import path from "path";

export async function importModulesFromDirectory(directory) {
  const files = await fsPromises.readdir(directory);
  const modules = {};

  for (const file of files) {
    if (file.endsWith(".js")) {
      const moduleName = path.parse(file).name;
      const modulePath = path.join(directory, file);
      modules[moduleName] = await import(modulePath);
    }
  }

  return modules;
}
