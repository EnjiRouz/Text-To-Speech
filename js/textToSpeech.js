// копределение кнопок
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const clearButton = document.getElementById("clear-button");

// определение полей ввода
const textArea = document.getElementById("textarea");
const speed = document.getElementById("speed");

// создание средства синтеза речи и получение списка голосов
const synthesis = window.speechSynthesis;
const voices = synthesis.getVoices();
const utterance = new SpeechSynthesisUtterance();

// текущий символ, который синтезируется в данный момент времени
let currentCharacter;

// назначение события на момент, когда речь перестанет проигрываться
utterance.addEventListener("end",()=>{
    textArea.disabled = false;
});

// получение символа, который синтезируется в данный момент
utterance.addEventListener("boundary", event=>{
    currentCharacter = event.charIndex;
});

/**
 * Поиск голоса для заданного языка речи
 * @param lang - заданный язык речи
 * @returns {null|SpeechSynthesisVoice}
 */
function findVoice(lang) {
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].lang === lang)
            return voices[i];
    }
    return null;
}

/**
 * Проигрывание синтезированного высказывания
 * @param textToPlay - текст, который должен быть синтезирован
 */
function playTextToSpeech(textToPlay){

    // если проигрывание речи было поставлено на паузу - происходит продожление проигрывания
    if(synthesis.paused && synthesis.speaking)
        return synthesis.resume();

    if(synthesis.speaking) return;

    // определение параметров синтезируемой речи
    utterance.text = textToPlay;
    utterance.rate = speed.value|| 1;
    utterance.lang = document.querySelector('input[name="speech-language"]:checked').value;
    utterance.voice = findVoice(utterance.lang);

    // отключение возможности редактировать текстовое поле, пока происходит синтез речи
    textArea.disabled = true;

    // проигрывание речи
    synthesis.speak(utterance);
}

/**
 * Установка проигрывания синтезированной речи на паузу
 */
function pauseTextToSpeech(){
    if (synthesis.speaking)
        synthesis.pause();
}

/**
 * Остановка (прекращение) проигрывания синтезированной речи
 */
function stopTextToSpeech(){
    // происходит выход из состояния паузы и немедленная остановка
    synthesis.resume();
    synthesis.cancel();
}

// назначений действий на соответствующие кнопки/поля
playButton.addEventListener("click",()=>{
    playTextToSpeech(textArea.value)
});

pauseButton.addEventListener("click", pauseTextToSpeech);
stopButton.addEventListener("click", stopTextToSpeech);

// изменение скорости речи в режиме реального времени
speed.addEventListener("input",()=>{
    if(synthesis.paused && synthesis.speaking) return;

    stopTextToSpeech();
    playTextToSpeech(utterance.text.substring(currentCharacter));
});

// очистка поля ввода текста
clearButton.addEventListener("click", ()=>{
    textArea.value = "";
});