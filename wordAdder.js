const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File paths
const bibleFile = path.join(__dirname, 'bibleNouns5Letters.txt');
const wordlistFile = path.join(__dirname, 'wordlist.js');
const hebwordsFile = path.join(__dirname, 'hebwords.js');

// Read bible words
const bibleWords = fs.readFileSync(bibleFile, 'utf8').split('\n').map(w => w.trim()).filter(w => w);

// Read wordlist.js and extract listOfWords
const wordlistContent = fs.readFileSync(wordlistFile, 'utf8');
const listOfWordsMatch = wordlistContent.match(/let listOfWords = \[([\s\S]*?)\];/);
if (!listOfWordsMatch) {
    console.error('Could not parse listOfWords from wordlist.js');
    process.exit(1);
}
const listOfWords = eval('[' + listOfWordsMatch[1] + ']'); // Simple way, assuming it's valid JS

// Read hebwords.js
const hebwordsContent = fs.readFileSync(hebwordsFile, 'utf8');
const hebWordsMatch = hebwordsContent.match(/const hebWords = "([\s\S]*?)";/);
if (!hebWordsMatch) {
    console.error('Could not parse hebWords from hebwords.js');
    process.exit(1);
}
let hebWordsString = hebWordsMatch[1];
let hebWords = hebWordsString.split(' ');

// Function to count occurrences
function countOccurrences(arr, word) {
    return arr.filter(w => w === word).length;
}

// Setup readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Process each word
async function processWords() {
    for (const word of bibleWords) {
        const countInWordlist = countOccurrences(listOfWords, word);
        const inHebwords = hebWords.includes(word);
        console.log(`Word: ${word}, Used in wordlist: ${countInWordlist}, In hebwords: ${inHebwords ? 'Yes' : 'No'}`);

        if (!inHebwords) {
            // Add to hebwords
            hebWords.push(word);
            hebWordsString += ' ' + word;
            console.log(`Added ${word} to hebwords.`);
        }

        if (countInWordlist === 0) {
            const answer = await askQuestion(`Add ${word} to wordlist? (y/n): `);
            if (answer.toLowerCase() === 'y') {
                listOfWords.push(word);
                console.log(`Added ${word} to wordlist.`);
            }
        }
    }

    // Write back hebwords.js
    const newHebwordsContent = hebwordsContent.replace(/const hebWords = "[\s\S]*?";/, `const hebWords = "${hebWordsString}";`);
    fs.writeFileSync(hebwordsFile, newHebwordsContent);

    // Write back wordlist.js
    const newListOfWordsStr = listOfWords.map(w => `"${w}"`).join(',\n');
    const newWordlistContent = wordlistContent.replace(/let listOfWords = \[[\s\S]*?\];/, `let listOfWords = [\n${newListOfWordsStr}\n];`);
    fs.writeFileSync(wordlistFile, newWordlistContent);

    console.log('Done.');
    rl.close();
}

processWords();