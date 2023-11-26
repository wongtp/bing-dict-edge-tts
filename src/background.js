// let allVoices = [];
// let speechSynthesisTemp = null;

// chrome.app.runtime.onLaunched.addListener(function() {
//     if (speechSynthesis == null) {
//         speechSynthesisTemp = chrome.speechSynthesis;
//     } else {
//         speechSynthesisTemp = speechSynthesis;
//     }
//     allVoices = speechSynthesisTemp.getVoices();
//     console.info("allVoices ==================== ");
//     console.info(allVoices);
// });
// window.speechSynthesis.onvoiceschanged = () => {
    
// };

chrome.runtime.onMessage.addListener(function(message) {
    console.info("message =========================");
    console.info(message);

    // if (speechSynthesis == null) {
    //     speechSynthesisTemp = chrome.speechSynthesis;
    // } else {
    //     speechSynthesisTemp = speechSynthesis;
    // }
    // allVoices = speechSynthesisTemp.getVoices();
    // const speakText = new SpeechSynthesisUtterance("A racket bounces a tennis ball up and down on the court , before a hand grabs the ball");
    // const selectedVoice = "Microsoft Jenny Online (Natural) - English (United States)"; //voiceOptions.selectedOptions[0].value;
    // speakText.rate = 1.1; // rate.value;
    // speakText.pitch = 1; // pitch.value;
    
    // allVoices.forEach(voice => {
    //     if (voice.name === selectedVoice) {
    //         speakText.voice = voice;
    //     }
    // });
    // speechSynthesisTemp.speak(speakText);
});