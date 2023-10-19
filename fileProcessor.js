const fs = require('fs');
const path = require('path');
const middlewares = require('./middlewares');

function processFile(dirPath, filePath, writeStream) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Apply middlewares
    for (const middleware of Object.values(middlewares)) {
        content = middleware(content);
    }

    // Write the header with relative path
    const relativePath = path.relative(dirPath, filePath);
    writeStream.write(`--- START OF FILE: ${relativePath} ---\n`);
    writeStream.write(content);
    writeStream.write(`\n--- END OF FILE: ${relativePath} ---\n\n`);
}

module.exports = processFile;
