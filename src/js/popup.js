const text = document.querySelector('.text');

const languageOptions = document.querySelector('.languages');
const voiceOptions = document.querySelector('.voices');

const rate = document.querySelector('.rate');
const pitch = document.querySelector('.pitch');

const speakButton = document.querySelector('.speak');
const stopButton = document.querySelector('.stop');
const pauseButton = document.querySelector('.pause');

let allVoices = [];
let allLanguages = [];

window.speechSynthesis.onvoiceschanged = () => {
    allVoices = speechSynthesis.getVoices();
    allVoices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
        voiceOptions.appendChild(option);
    });

    allLanguages = allVoices.map(voice => `${voice.name.split("-")[1].replace(/\(.+\)/g, "")} - ${voice.lang.split("-")[0]}`);
    allLanguages = [...new Set(allLanguages)];
    allLanguages.forEach(language => {
        const option = document.createElement('option');
        option.value = language;
        option.textContent = `${language}`;
        languageOptions.appendChild(option);
    });
    loadConfig();
};

const speak = () => {
    saveConfig();
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.resume();
    } else if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    } else {
        const speakText = new SpeechSynthesisUtterance(text.value);
        const selectedVoice = voiceOptions.value;
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        allVoices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        speechSynthesis.speak(speakText);
    }
};

const stop = () => {
    speechSynthesis.cancel();
};

const pause = () => {
    speechSynthesis.pause();
};

const saveConfig = () => {
    var speakConfig = {};
    speakConfig.selectedLanguage = languageOptions.value
    speakConfig.selectedVoice = voiceOptions.value;
    speakConfig.rate = rate.value;
    speakConfig.pitch = pitch.value;
    chrome.storage.local.set({speakConfig: JSON.stringify(speakConfig)});
}

const loadConfig = () => {
    chrome.storage.local.get(['speakConfig'], function(result) {
        const speakConfigJson = result.speakConfig;
        if (speakConfigJson == null) {
            return;
        }
        const speakConfig = JSON.parse(speakConfigJson);
    
        const allLanguages = languageOptions.getElementsByTagName("option");
        for (let index = 0; index < allLanguages.length; index++) {
            const language = allLanguages[index];
            if (language.value === speakConfig.selectedLanguage) {
                language.selected = true;
            }
        }
        rate.value = speakConfig.rate;
        pitch.value = speakConfig.pitch;
        
        languageOptions.dispatchEvent(new Event('change'));
    
        const allVoices = voiceOptions.getElementsByTagName("option");
        for (let index = 0; index < allVoices.length; index++) {
            const voice = allVoices[index];
            if (voice.value === speakConfig.selectedVoice) {
                voice.selected = true;
            }
        }
    });
}

speakButton.addEventListener('click', e => speak());
stopButton.addEventListener('click', e => stop());
pauseButton.addEventListener('click', e => pause());

voiceOptions.addEventListener('change', () => saveConfig());
pitch.addEventListener('change', () => saveConfig());
rate.addEventListener('change', e => {
    rate.textContent = rate.value;
    saveConfig();
});

// update voices on language change
languageOptions.addEventListener('change', () => {
    if (languageOptions.value === 'All') {
        voiceOptions.innerHTML = '';
        allVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
            voiceOptions.appendChild(option);
        });
    } else {
        const selectedLanguage = languageOptions.value.split(" - ")[1];
        const filteredVoices = allVoices.filter(voice => voice.lang.split("-")[0] === selectedLanguage);
        voiceOptions.innerHTML = '';
        filteredVoices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            option.innerText = `${voice.name.split("-")[1]} - ${voice.name.split("-")[0].replace(/(Microsoft|Online \(Natural\))/g, '')}`;
            voiceOptions.appendChild(option);
        });
    }
    saveConfig();
});

