function countTokens(content) {
    // Split content based on whitespace and punctuation to get tokens
    const tokens = content.split(/\s+|\b/).filter(Boolean);
    return tokens.length;
}

module.exports = countTokens;
