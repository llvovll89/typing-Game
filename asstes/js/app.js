// DOM
const wrap = document.querySelector('.wrap');
const word = document.querySelector(".word");
const container = document.querySelector(".container");
const content = document.querySelector(".content");
const wordInput = document.querySelector(".word-input");
const score = document.querySelector(".point");
const timer = document.querySelector(".timer");
const btn = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const innerText = document.querySelector('.innerText');
const restart = document.querySelector(".restart");

// 변수
const GAMETIMER = 4;
let point = 0;
let time = GAMETIMER;
let playing = false;
let intervalTime;
let intervalCheck;

// 빈 배열 단어
let wordsArr = [];

init();
// 초기화
function init() {
  words();
  wordInput.addEventListener("input", checkWords);
  timer.innerText = time;
  score.innerText = 0;
}

// 시작시 - 배열에 단어추가
function words() {
  axios
    .get("https://random-word-api.herokuapp.com/word?number=50")
    .then((response) => {
      response.data.forEach((word1) => {
        if (word1.length < 10) {
          wordsArr.push(word1);
          word.innerText = word1;
        }
      });
      btnChange("Start");
    })
    .catch((err) => {
      console.log(err);
    });
}

function checkWords() {
  if (wordInput.value.toLowerCase() === word.innerText.toLowerCase()) {
    wordInput.value = "";
    if (!playing) {
      return;
    }
    point++;
    score.innerText = point;
    time = GAMETIMER;
    const ranWords = Math.floor(Math.random() * wordsArr.length);
    word.innerText = wordsArr[ranWords];
  }
}

function checkStatus() {
  if (!playing && time === 0) {
    btnChange("Start");
    clearInterval(intervalCheck);
  }
}

function countDown() {
  time > 0 ? time-- : (playing = false);
  if (!playing) {
    clearInterval(intervalTime);
    word.classList.remove("word-out");
  }
  if (timer.innerText === "0") {
    innerText.innerText = `당신의 점수는 "${point}"점 입니다!`
    modal.classList.add("active");
    clearInterval(intervalTime);
    container.classList.add("out");
    wrap.classList.add('off');

    restart.addEventListener("click", () => {
      modal.classList.remove("active");
      container.classList.remove("out");
      wrap.classList.remove('off');
      init();
    });
  } else {
    timer.innerText = time;
  }
}

function btnChange(text) {
  btn.innerText = text;
  text === "Start"
    ? btn.classList.remove("loading")
    : btn.classList.add("loading");
}

btn.addEventListener("click", () => {
  word.classList.add("word-out");
  if (playing) {
    return;
  }
  playing = true;
  time = GAMETIMER;
  timer.innerText = time;
  wordInput.focus();
  point.innerText = 0;
  intervalTime = setInterval(countDown, 1000);
  intervalCheck = setInterval(checkStatus, 50);
  btnChange("Game Ing ,,,");
});
