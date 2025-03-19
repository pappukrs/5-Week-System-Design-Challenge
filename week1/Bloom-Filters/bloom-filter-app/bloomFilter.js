// Bloom Filter Implementation in Node.js
const crypto = require('crypto');

class BloomFilter {
    constructor(size = 100) {
        this.size = size;
        this.bitArray = new Array(size).fill(0);
    }

    // Hash functions
    hash1(value) {
        return crypto.createHash('md5').update(value).digest('hex').split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.size;
    }

    hash2(value) {
        return crypto.createHash('sha1').update(value).digest('hex').split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.size;
    }

    hash3(value) {
        return crypto.createHash('sha256').update(value).digest('hex').split('')
            .reduce((acc, char) => acc + char.charCodeAt(0), 0) % this.size;
    }

    // Add item to Bloom Filter
    add(value) {
        let pos1 = this.hash1(value);
        let pos2 = this.hash2(value);
        let pos3 = this.hash3(value);

        this.bitArray[pos1] = 1;
        this.bitArray[pos2] = 1;
        this.bitArray[pos3] = 1;
    }

    // Check if item might exist
    contains(value) {
        let pos1 = this.hash1(value);
        let pos2 = this.hash2(value);
        let pos3 = this.hash3(value);

        return this.bitArray[pos1] && this.bitArray[pos2] && this.bitArray[pos3];
    }
}

module.exports = new BloomFilter(100); // Exporting a Bloom Filter with 100 bits
