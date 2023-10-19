// Middleware to process Rust files and trim off test code
function rustTestTrimMiddleware(content) {
    const lines = content.split('\n');
    let braceCount = 0;
    let insideTestBlock = false;
    const processedLines = [];

    for (const line of lines) {
        if (line.trim() === '#[cfg(test)]') {
            insideTestBlock = true;
            continue;
        }

        if (insideTestBlock) {
            if (line.includes('{')) {
                braceCount++;
            }
            if (line.includes('}')) {
                braceCount--;
            }

            if (braceCount === 0) {
                insideTestBlock = false;
                continue;
            }
        }

        if (!insideTestBlock) {
            processedLines.push(line);
        }
    }

    return processedLines.join('\n');
}

module.exports = {
    rustTestTrimMiddleware
};
