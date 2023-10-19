const fs = require('fs');
const walkDirectory = require('./directoryWalker');

// Get directory path and output file from environment variables
const dirPath = process.env.ROOT_DIR;
const baseOutputFile = process.env.OUTPUT_FILE.replace('.txt', ''); // Remove .txt to use as base filename

if (!dirPath || !baseOutputFile) {
    console.error('Please set the ROOT_DIR and OUTPUT_FILE environment variables.');
    process.exit(1);
}

walkDirectory(dirPath, baseOutputFile);

console.log(`Files in ${dirPath} have been concatenated into ${baseOutputFile}_1...N.txt and metadata has been written to ${baseOutputFile}_metadata.txt`);
