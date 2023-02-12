// Import the modules required for this utility
const fs = require('fs');
const util = require('util');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const statPromise = util.promisify(fs.stat);

/**
 *  Function to read the contents of a file given a destination and filename
 *  @param {string} file The file you want to read from.
 *  @param {object} directory The relative path to the file.
 *  @returns {string} The contents of the file.
 */
const readFromFile = async (directory, file) => {
  // Resolve the path to the file
  const fullPath = resolve("./", directory, file);

  // Check if the path exists.
  try {
    const stats = await statPromise(fullPath);

    // Check if the path belongs to a file.
    if (!stats.isFile()) {
      console.log(`"${fullPath}" is not a file!`);
      process.exit(1);
    }
  } catch (err) {
    console.log(`"${fullPath}" does not exist!`);
    process.exit(1);
  }


  // Read file.
  return await readFile(fullPath, { encoding: 'utf8' });
};


module.exports = { readFromFile };
