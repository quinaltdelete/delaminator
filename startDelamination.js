let audioContext;
let binauralOscillators = [];

// Function to create binaural beat
function startBinauralBeat() {
    // Create audio context if it doesn't exist
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Stop any existing binaural beat
    stopBinauralBeat();

    // Create oscillators for left and right ear
    const leftOscillator = audioContext.createOscillator();
    const rightOscillator = audioContext.createOscillator();
    
    // Create stereo panner nodes
    const leftPanner = audioContext.createStereoPanner();
    const rightPanner = audioContext.createStereoPanner();
    
    // Create gain nodes for volume control
    const leftGain = audioContext.createGain();
    const rightGain = audioContext.createGain();
    
    // Set base frequency and beat frequency
    const baseFrequency = 200; // Hz - try 100-400 for different effects
    const beatFrequency = 7; // Hz - 7Hz is in the theta range (weird/dreamy)
    
    // Set frequencies (slightly different for each ear)
    leftOscillator.frequency.value = baseFrequency;
    rightOscillator.frequency.value = baseFrequency + beatFrequency;
    
    // Set wave type (sine is smoothest, but try 'square' or 'sawtooth' for harsher)
    leftOscillator.type = 'sine';
    rightOscillator.type = 'sine';
    
    // Pan left and right
    leftPanner.pan.value = -1; // Full left
    rightPanner.pan.value = 1; // Full right
    
    // Set volume (lower for background effect)
    leftGain.gain.value = 0.2;
    rightGain.gain.value = 0.2;
    
    // Connect the audio graph
    leftOscillator.connect(leftGain);
    leftGain.connect(leftPanner);
    leftPanner.connect(audioContext.destination);
    
    rightOscillator.connect(rightGain);
    rightGain.connect(rightPanner);
    rightPanner.connect(audioContext.destination);
    
    // Start oscillators
    leftOscillator.start();
    rightOscillator.start();
    
    // Store references to stop later
    binauralOscillators = [
        { oscillator: leftOscillator, gain: leftGain },
        { oscillator: rightOscillator, gain: rightGain }
    ];
    
    // Slowly modulate the frequencies
    let time = 0;
    const modulation = setInterval(() => {
        time += 0.1;
        // Subtle frequency wobble
        leftOscillator.frequency.value = baseFrequency + Math.sin(time * 0.1) * 5;
        rightOscillator.frequency.value = baseFrequency + beatFrequency + Math.cos(time * 0.1) * 5;
        
        // Subtle volume pulsing
        const volumePulse = 0.2 + Math.sin(time * 0.5) * 0.05;
        leftGain.gain.value = volumePulse;
        rightGain.gain.value = volumePulse;
    }, 100);
    
    // Store the interval to clear it later
    binauralOscillators.modulation = modulation;
}

// Function to stop binaural beat
function stopBinauralBeat() {
    binauralOscillators.forEach(item => {
        if (item.gain) {
            // Fade out smoothly
            item.gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
        }
        if (item.oscillator) {
            item.oscillator.stop(audioContext.currentTime + 0.5);
        }
    });
    
    if (binauralOscillators.modulation) {
        clearInterval(binauralOscillators.modulation);
    }
    
    binauralOscillators = [];
}

// Define Font Awesome icons
const icons = [
    // Safety & Warning
    'fa-solid fa-skull-crossbones',
    'fa-solid fa-radiation',
    'fa-solid fa-biohazard',
    'fa-solid fa-triangle-exclamation',
    'fa-solid fa-bolt',
    'fa-solid fa-fire',
    'fa-solid fa-bomb',
    'fa-solid fa-virus',
    'fa-solid fa-skull',
    'fa-solid fa-exclamation',
    
    // Directional & Instructional
    'fa-solid fa-arrow-up',
    'fa-solid fa-arrow-down',
    'fa-solid fa-arrow-left',
    'fa-solid fa-arrow-right',
    'fa-solid fa-rotate-right',
    'fa-solid fa-rotate-left',
    'fa-solid fa-arrows-spin',
    'fa-solid fa-shuffle',
    'fa-solid fa-turn-up',
    'fa-solid fa-turn-down',
    
    // Status & State
    'fa-solid fa-check',
    'fa-solid fa-xmark',
    'fa-solid fa-ban',
    'fa-solid fa-stop',
    'fa-solid fa-play',
    'fa-solid fa-pause',
    'fa-solid fa-power-off',
    'fa-solid fa-circle-stop',
    'fa-solid fa-battery-full',
    'fa-solid fa-battery-empty',
    
    // Emotional & Social
    'fa-solid fa-heart',
    'fa-solid fa-heart-crack',
    'fa-solid fa-thumbs-up',
    'fa-solid fa-thumbs-down',
    'fa-solid fa-face-smile',
    'fa-solid fa-face-frown',
    'fa-solid fa-face-angry',
    'fa-solid fa-face-surprise',
    'fa-solid fa-star',
    'fa-solid fa-poop',
    
    // Commercial & Universal
    'fa-solid fa-dollar-sign',
    'fa-solid fa-euro-sign',
    'fa-solid fa-yen-sign',
    'fa-solid fa-cart-shopping',
    'fa-solid fa-credit-card',
    'fa-solid fa-wifi',
    'fa-solid fa-bluetooth',
    'fa-solid fa-at',
    'fa-solid fa-hashtag',
    'fa-solid fa-percent',
    
    // Objects & Tools
    'fa-solid fa-phone',
    'fa-solid fa-envelope',
    'fa-solid fa-bell',
    'fa-solid fa-house',
    'fa-solid fa-car',
    'fa-solid fa-plane',
    'fa-solid fa-train',
    'fa-solid fa-key',
    'fa-solid fa-lock',
    'fa-solid fa-unlock',
    
    // Medical & Emergency
    'fa-solid fa-hospital',
    'fa-solid fa-syringe',
    'fa-solid fa-pills',
    'fa-solid fa-wheelchair',
    'fa-solid fa-stethoscope',
    'fa-solid fa-ambulance',
    'fa-solid fa-briefcase-medical',
    'fa-solid fa-kit-medical',
    'fa-solid fa-truck-medical',
    'fa-solid fa-user-doctor',
    
    // Nature & Weather
    'fa-solid fa-sun',
    'fa-solid fa-moon',
    'fa-solid fa-cloud',
    'fa-solid fa-bolt-lightning',
    'fa-solid fa-snowflake',
    'fa-solid fa-fire-flame-curved',
    'fa-solid fa-water',
    'fa-solid fa-tree',
    'fa-solid fa-mountain',
    'fa-solid fa-wind',
    
    // Technology & Digital
    'fa-solid fa-robot',
    'fa-solid fa-microchip',
    'fa-solid fa-database',
    'fa-solid fa-server',
    'fa-solid fa-code',
    'fa-solid fa-bug',
    'fa-solid fa-terminal',
    'fa-solid fa-satellite',
    'fa-solid fa-signal',
    'fa-solid fa-rss',
    
    // Random & Miscellaneous
    'fa-solid fa-toilet',
    'fa-solid fa-dumpster-fire',
    'fa-solid fa-pizza-slice',
    'fa-solid fa-ghost',
    'fa-solid fa-spider',
    'fa-solid fa-eye',
    'fa-solid fa-eye-slash',
    'fa-solid fa-brain',
    'fa-solid fa-tooth',
    'fa-solid fa-bone'
];

const texts = [
    // Directional/Movement
    'forward',
    'stop',
    'reverse',
    'up',
    'down',
    'left',
    'right',
    'begin',
    'end',
    'enter',
    'exit',
    'push',
    'pull',
    'rotate',
    'freeze',
    
    // Emotional/Descriptive
    'happy',
    'angry',
    'evil',
    'blessed',
    'cursed',
    'sacred',
    'toxic',
    'pure',
    'corrupt',
    'innocent',
    'guilty',
    'love',
    'hate',
    'peace',
    'war',
    
    // States/Conditions
    'hot',
    'cold',
    'wet',
    'dry',
    'full',
    'empty',
    'open',
    'closed',
    'on',
    'off',
    'alive',
    'dead',
    'fresh',
    'rotten',
    'clean',
    'dirty',
    
    // Actions/Commands
    'eat',
    'drink',
    'sleep',
    'wake',
    'speak',
    'silence',
    'buy',
    'sell',
    'save',
    'delete',
    'accept',
    'reject',
    'allow',
    'forbid',
    'heal',
    'harm',
    
    // Objects/Things
    'airplane',
    'bicycle',
    'hammer',
    'flower',
    'weapon',
    'toy',
    'food',
    'poison',
    'medicine',
    'garbage',
    'treasure',
    'gift',
    'bomb',
    'candy',
    'tool',
    
    // Qualities
    'safe',
    'danger',
    'urgent',
    'optional',
    'required',
    'forbidden',
    'legal',
    'illegal',
    'real',
    'fake',
    'natural',
    'artificial',
    'expensive',
    'free',
    'heavy',
    'light',
    
    // Time/Speed
    'fast',
    'slow',
    'now',
    'later',
    'never',
    'always',
    'early',
    'late',
    'instant',
    'eternal',
    
    // Simple Verbs
    'go',
    'stay',
    'run',
    'walk',
    'fly',
    'sink',
    'rise',
    'fall',
    'break',
    'fix',
    
    // Abstract Concepts
    'yes',
    'no',
    'maybe',
    'truth',
    'lie',
    'dream',
    'nightmare',
    'hope',
    'fear',
    'chaos'
];

const audios = [
    'audio/forward.mp3',
    'audio/stop.mp3',
    'audio/reverse.mp3',
    'audio/up.mp3',
    'audio/down.mp3',
    'audio/left.mp3',
    'audio/right.mp3',
    'audio/begin.mp3',
    'audio/end.mp3',
    'audio/enter.mp3',
    'audio/exit.mp3',
    'audio/push.mp3',
    'audio/pull.mp3',
    'audio/rotate.mp3',
    'audio/freeze.mp3',
    'audio/happy.mp3',
    'audio/angry.mp3',
    'audio/evil.mp3',
    'audio/blessed.mp3',
    'audio/cursed.mp3',
    'audio/sacred.mp3',
    'audio/toxic.mp3',
    'audio/pure.mp3',
    'audio/corrupt.mp3',
    'audio/innocent.mp3',
    'audio/guilty.mp3',
    'audio/love.mp3',
    'audio/hate.mp3',
    'audio/peace.mp3',
    'audio/war.mp3',
    'audio/hot.mp3',
    'audio/cold.mp3',
    'audio/wet.mp3',
    'audio/dry.mp3',
    'audio/full.mp3',
    'audio/empty.mp3',
    'audio/open.mp3',
    'audio/closed.mp3',
    'audio/on.mp3',
    'audio/off.mp3',
    'audio/alive.mp3',
    'audio/dead.mp3',
    'audio/fresh.mp3',
    'audio/rotten.mp3',
    'audio/clean.mp3',
    'audio/dirty.mp3',
    'audio/eat.mp3',
    'audio/drink.mp3',
    'audio/sleep.mp3',
    'audio/wake.mp3',
    'audio/speak.mp3',
    'audio/silence.mp3',
    'audio/buy.mp3',
    'audio/sell.mp3',
    'audio/save.mp3',
    'audio/delete.mp3',
    'audio/accept.mp3',
    'audio/reject.mp3',
    'audio/allow.mp3',
    'audio/forbid.mp3',
    'audio/heal.mp3',
    'audio/harm.mp3',
    'audio/airplane.mp3',
    'audio/bicycle.mp3',
    'audio/hammer.mp3',
    'audio/flower.mp3',
    'audio/weapon.mp3',
    'audio/toy.mp3',
    'audio/food.mp3',
    'audio/poison.mp3',
    'audio/medicine.mp3',
    'audio/garbage.mp3',
    'audio/treasure.mp3',
    'audio/gift.mp3',
    'audio/bomb.mp3',
    'audio/candy.mp3',
    'audio/tool.mp3',
    'audio/safe.mp3',
    'audio/danger.mp3',
    'audio/urgent.mp3',
    'audio/optional.mp3',
    'audio/required.mp3',
    'audio/forbidden.mp3',
    'audio/legal.mp3',
    'audio/illegal.mp3',
    'audio/real.mp3',
    'audio/fake.mp3',
    'audio/natural.mp3',
    'audio/artificial.mp3',
    'audio/expensive.mp3',
    'audio/free.mp3',
    'audio/heavy.mp3',
    'audio/light.mp3',
    'audio/fast.mp3',
    'audio/slow.mp3',
    'audio/now.mp3',
    'audio/later.mp3',
    'audio/never.mp3',
    'audio/always.mp3',
    'audio/early.mp3',
    'audio/late.mp3',
    'audio/instant.mp3',
    'audio/eternal.mp3',
    'audio/go.mp3',
    'audio/stay.mp3',
    'audio/run.mp3',
    'audio/walk.mp3',
    'audio/fly.mp3',
    'audio/sink.mp3',
    'audio/rise.mp3',
    'audio/fall.mp3',
    'audio/break.mp3',
    'audio/fix.mp3',
    'audio/yes.mp3',
    'audio/no.mp3',
    'audio/maybe.mp3',
    'audio/truth.mp3',
    'audio/lie.mp3',
    'audio/dream.mp3',
    'audio/nightmare.mp3',
    'audio/hope.mp3',
    'audio/fear.mp3',
    'audio/chaos.mp3',
    'audio/go_away.mp3',
    'audio/come_back.mp3',
    'audio/follow.mp3',
    'audio/run_away.mp3',
    'audio/tread_lightly.mp3',
    'audio/regret.mp3',
    'audio/train.mp3',
    'audio/car.mp3',
    'audio/no_entry.mp3',
    'audio/sun.mp3',
    'audio/moon.mp3',
    'audio/disaster_zone.mp3',
    'audio/away.mp3',
    'audio/out_to_lunch.mp3',
    'audio/returning_soon.mp3',
    'audio/avoid_at_all_costs.mp3',
    'audio/return_to_sender.mp3',
    'audio/home.mp3',
    'audio/violent.mp3',
    'audio/turn_back.mp3',
    'audio/continue_at_low_speed.mp3',
    'audio/sensitive_topic.mp3',
    'audio/not_safe_for_work.mp3',
    'audio/appropriate_for_all_ages.mp3',
    'audio/self_destruct.mp3',
    'audio/save_for_later.mp3',
    'audio/for_immediate_use.mp3',
    'audio/do_not_get_in_eyes.mp3',
    'audio/wash_thoroughly.mp3'
];

let delaminationInterval;
let delaminationTimeout;

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function showRandomContent() {
    // Get random items
    const randomIcon = getRandomItem(icons);
    const randomText = getRandomItem(texts);

    // Update icon 
    const iconContainer = document.getElementById('display-area');
    const existingIcon = document.getElementById('random-icon');
    if (existingIcon) {
        existingIcon.remove();
    }
    
    // Create new icon element
    const newIcon = document.createElement('i');
    newIcon.id = 'random-icon';
    newIcon.className = randomIcon;
    
    // Insert before the text
    const textElement = document.getElementById('random-text');
    iconContainer.insertBefore(newIcon, textElement);
    
    // Update text
    textElement.textContent = randomText;
    
    // Play audio
    const audioElement = document.getElementById('random-audio');
    const randomAudio = getRandomItem(audios);
    audioElement.src = randomAudio;
    audioElement.play();
}

function startDelamination() {
    // Hide button and show display area
    document.getElementById('control-area').style.display = 'none';
    document.getElementById('display-area').style.display = 'block';
    document.getElementById('complete-message').style.display = 'none';

    // Start background sound
    startBinauralBeat();

    // Small delay to ensure Font Awesome is ready
    setTimeout(() => {
        // Show first random content
        showRandomContent();

        // Change content every 2 seconds
        delaminationInterval = setInterval(showRandomContent, 2000);

        // Stop after 60 seconds
        delaminationTimeout = setTimeout(() => {
            stopDelamination();
            stopBinauralBeat();
        }, 60000);
    }, 100);

}

function stopDelamination() {
    // Clear interval
    clearInterval(delaminationInterval);
    
    // Stop audio
    const audioElement = document.getElementById('random-audio');
    audioElement.pause();
    
    // Hide display area and show complete message
    document.getElementById('display-area').style.display = 'none';
    document.getElementById('complete-message').style.display = 'block';
    
    // Reset after 5 seconds
    setTimeout(() => {
        document.getElementById('complete-message').style.display = 'none';
        document.getElementById('control-area').style.display = 'block';
    }, 5000);
}