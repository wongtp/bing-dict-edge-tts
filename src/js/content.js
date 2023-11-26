let allVoices = [];
let speakConfig;

window.speechSynthesis.onvoiceschanged = () => {
    allVoices = speechSynthesis.getVoices();
    
    // Optimize the first play sound delay of 1-2 seconds.
    speak("");
}

document.getElementById("headword").onclick = function() {
  speak();
}

const bindSpeaker = () => {
    const regtxts = document.getElementsByClassName("val b_regtxt");
    if (regtxts == null) {
        return;
    }
    for (let index = 0; index < regtxts.length; index++) {
        const regtxt = regtxts[index];
        var link = createSpeakerTag(regtxt.textContent);
        regtxt.parentNode.insertBefore(link, null);
    }

    const seLis = document.getElementsByClassName("se_li1");
    if (seLis == null) {
        return;
    }
    for (let index = 0; index < seLis.length; index++) {
        const seLi = seLis[index];
        const regtxt = seLi.getElementsByClassName("sen_en b_regtxt")[0];
        
        var link = createSpeakerTag(regtxt.textContent);
        
        const speakerTagContainer = seLi.getElementsByClassName("gl_fl")[0];
        const speakerTag = speakerTagContainer.querySelector("a");
        speakerTagContainer.removeChild(speakerTag);
        speakerTagContainer.insertBefore(link, null);
  }
}

function createSpeakerTag(text) {
    var link = document.createElement('a');
    link.href = 'javascript:;';
    link.textContent = '🔊';
    link.onclick = () => speak(text);
    return link;
}


bindSpeaker();

function speak(text) {
    chrome.storage.local.get(['speakConfig'], function (result) {
        const speakConfigJson = result.speakConfig;
        if (speakConfigJson == null) {
            alert("Please click the plugin icon to configure the pronunciation.");
            return;
        }
        const speakConfig = JSON.parse(speakConfigJson);
        const selectedVoice = speakConfig.selectedVoice;

        const speakText = new SpeechSynthesisUtterance(text);
        speakText.rate = speakConfig.rate;
        speakText.pitch = speakConfig.pitch;

        allVoices.forEach(voice => {
            if (voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });
        speechSynthesis.speak(speakText);
  });
}
