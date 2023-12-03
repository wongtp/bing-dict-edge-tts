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

bindSpeaker();

function bindSpeaker() {
    bingSentenceSpeaker();
    bindAuthSpeaker();
    bingHomoSpeaker();
    bingThesaurusesSpeaker();
}

/**
 * 绑定【例句】功能的发音
 */
function bingSentenceSpeaker() {
    const regtxts = document.getElementsByClassName("val b_regtxt");
    if (regtxts != null) {
        for (let index = 0; index < regtxts.length; index++) {
            const regtxt = regtxts[index];
            var link = createSpeakerTag(regtxt.textContent);
            regtxt.parentNode.insertBefore(link, null);
        }
    }
}

/**
 * 绑定【权威英汉双解】功能的发音
 */
function bindAuthSpeaker() {
    const seLis = document.getElementsByClassName("se_li1");
    if (seLis != null) {
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
    return link;
}

/**
 * 绑定【英英】词典功能的发音
 */
function bingHomoSpeaker() {
    const homo = document.getElementById("homoid");
    if (homo != null) {
        const dfCrList = homo.getElementsByClassName("df_cr_w");
        if (dfCrList != null) {
            for (let index = 0; index < dfCrList.length; index++) {
                const regtxt = dfCrList[index];
                var link = createSpeakerTag(regtxt.innerText);
                regtxt.insertBefore(link, null);
            }
        }
    }
    return link;
}

/**
 * 绑定【搭配、同义词、反义词】功能的发音
 */
function bingThesaurusesSpeaker() {
    const thesauruses = document.getElementById("thesaurusesid");
    if (thesauruses != null) {
        const eleList = thesauruses.getElementsByClassName("col_fl");
        if (eleList != null) {
            for (let index = 0; index < eleList.length; index++) {
                const ele = eleList[index];
                var link = createSpeakerTag(ele.innerText);
                ele.insertBefore(link, null);
            }
        }
    }
    return link;
}

function createSpeakerTag(text) {
    var optimizeText = text.replace(/ sb\/sth/g, " somebody or something")
                           .replace(/ sb /g, " somebody ")
                           .replace(/ sb;/g, " somebody;")
                           .replace(/ sb./g, " somebody.")
                           .replace(/ sth /g, " something ")
                           .replace(/ sth;/g, " something;")
                           .replace(/ sth./g, " something.");
    optimizeText = optimizeText.endsWith(" sb") ? optimizeText.replace(/(.*) sb/, "$1 somebody") : optimizeText;
    optimizeText = optimizeText.endsWith(" sth") ? optimizeText.replace(/(.*) sth/, "$1 something") :  optimizeText;

    var link = document.createElement('a');
    link.href = 'javascript:;';
    link.textContent = '🔊';
    link.onclick = () => speak(optimizeText);
    return link;
}

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


