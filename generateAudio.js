const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Set up credentials - using your existing credentials.json
process.env.GOOGLE_APPLICATION_CREDENTIALS = './credentials.json';

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// Create audio directory if it doesn't exist
const audioDir = './audio';
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir);
}

// Your word list - same as in startDelamination.js
const words = [
    'forward', 'stop', 'reverse', 'up', 'down', 'left', 'right', 'begin', 'end',
    'enter', 'exit', 'push', 'pull', 'rotate', 'freeze', 'happy', 'angry', 'evil',
    'blessed', 'cursed', 'sacred', 'toxic', 'pure', 'corrupt', 'innocent', 'guilty',
    'love', 'hate', 'peace', 'war', 'hot', 'cold', 'wet', 'dry', 'full', 'empty',
    'open', 'closed', 'on', 'off', 'alive', 'dead', 'fresh', 'rotten', 'clean',
    'dirty', 'eat', 'drink', 'sleep', 'wake', 'speak', 'silence', 'buy', 'sell',
    'save', 'delete', 'accept', 'reject', 'allow', 'forbid', 'heal', 'harm',
    'airplane', 'bicycle', 'hammer', 'flower', 'weapon', 'toy', 'food', 'poison',
    'medicine', 'garbage', 'treasure', 'gift', 'bomb', 'candy', 'tool', 'safe',
    'danger', 'urgent', 'optional', 'required', 'forbidden', 'legal', 'illegal',
    'real', 'fake', 'natural', 'artificial', 'expensive', 'free', 'heavy', 'light',
    'fast', 'slow', 'now', 'later', 'never', 'always', 'early', 'late', 'instant',
    'eternal', 'go', 'stay', 'run', 'walk', 'fly', 'sink', 'rise', 'fall', 'break',
    'fix', 'yes', 'no', 'maybe', 'truth', 'lie', 'dream', 'nightmare', 'hope',
    'fear', 'chaos', 'go away', 'come back', 'hope', 'follow', 'run away', 'tread lightly',
    'regret', 'train', 'car', 'fear', 'no entry', 'sun', 'moon', 'disaster zone', 'away', 
    'out to lunch', 'returning soon', 'avoid at all costs', 'return to sender', 'home',
    'violent', 'innocent', 'turn back', 'continue at low speed', 'buy', 'sell',
    'delete', 'sensitive topic', 'not safe for work', 'appropriate for all ages',
    'self destruct', 'save for later', 'for immediate use', 'do not get in eyes', 'wash thoroughly',
    'do not consume', 'hospital', 'common', 'mandatory', 'warning', 'safe', 'shelter'
];

async function generateAudio() {
    console.log('Starting audio generation...');
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        console.log(`Generating ${i + 1}/${words.length}: ${word}`);

        const request = {
            input: { text: word.toUpperCase() },
            voice: {
                languageCode: 'en-gb',
                name: 'en-GB-Neural2-F',
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.85,
                pitch: -2.0,
                volumeGainDb: 0.0
            },
        };

        try {
            const [response] = await client.synthesizeSpeech(request);
            const filename = path.join(audioDir, `${word.toLowerCase().replace(/\s+/g, '_')}.mp3`);
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(filename, response.audioContent, 'binary');
        } catch (error) {
            console.error(`Error generating ${word}:`, error);
        }
    }
    
    console.log('Done! Generated all audio files.');
    console.log('\nNow update the audios array in startDelamination.js with:');
    console.log('const audios = [');
    words.forEach(word => {
        console.log(`    'audio/${word.toLowerCase().replace(/\s+/g, '_')}.mp3',`);
    });
    console.log('];');
}

// Run the generation
generateAudio();