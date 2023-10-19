const fs = require('fs');
const path = require('path');
const countTokens = require('./tokenCounter');

const TOKEN_THRESHOLD = 2000; // Example threshold, adjust as needed

function collectFiles(directory, rootDir, depth = 0) {
    const filesList = [];
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        // Skip directories named "tests"
        if (stat.isDirectory() && file === "tests") {
            continue;
        }

        const relativePath = path.relative(rootDir, filePath); // Use rootDir for relative path

        if (stat.isFile()) {
            filesList.push({ path: relativePath, depth });
        } else if (stat.isDirectory()) {
            filesList.push(...collectFiles(filePath, rootDir, depth + 1)); // Pass rootDir to recursive calls
        }
    }
    return filesList;
}

function writeContentToFile(dirPath, baseOutputFile, filesList) {
    let fullContent = '';
    let fileIndex = 1;
    let currentTokenCount = 0;
    let totalTokenCount = 0; // Accumulate total token count

    for (const fileInfo of filesList) {
        const filePath = path.join(dirPath, fileInfo.path);

        // Logging the file path before reading
        console.log(`Trying to read: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.warn(`File does not exist: ${filePath}`);
            continue;
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const fileTokenCount = countTokens(fileContent);
        totalTokenCount += fileTokenCount; // Add to the total token count

        // Check if adding this file's content would exceed the threshold
        if (currentTokenCount + fileTokenCount > TOKEN_THRESHOLD && currentTokenCount !== 0) {
            fs.writeFileSync(`${baseOutputFile}_${fileIndex}.txt`, fullContent);
            fileIndex++;
            fullContent = '';
            currentTokenCount = 0;
        }

        fullContent += `--- START OF FILE: ${fileInfo.path} ---\n`;
        fullContent += fileContent;
        fullContent += `\n--- END OF FILE: ${fileInfo.path} ---\n\n`;
        currentTokenCount += fileTokenCount;
    }

    // Write any remaining content to the output file
    if (fullContent) {
        fs.writeFileSync(`${baseOutputFile}_${fileIndex}.txt`, fullContent);
    }

    return totalTokenCount; // Return the total token count
}

function writeMetadata(baseOutputFile, filesList, totalTokenCount) {
    let metadataContent = `--- FILE HIERARCHY ---\n`;
    for (const fileInfo of filesList) {
        const indentation = '  '.repeat(fileInfo.depth);
        metadataContent += indentation + fileInfo.path + '\n';
    }
    metadataContent += `\n--- TOKEN COUNT ---\nTotal number of tokens: ${totalTokenCount}\n`; // Use the accumulated total token count
    fs.writeFileSync(`${baseOutputFile}_metadata.txt`, metadataContent);
}

function walkDirectory(dirPath, baseOutputFile) {
    const filesList = collectFiles(dirPath, dirPath);
    const totalTokenCount = writeContentToFile(dirPath, baseOutputFile, filesList); // Get the total token count
    writeMetadata(baseOutputFile, filesList, totalTokenCount);
}

module.exports = walkDirectory;
