let timerId;
let isRunning = false;
let elapsedTime = 0;
const $stopwatch = document.querySelector('.timer');
let min, sec;


const modal = document.querySelector('.pause-modal');
const btnPause = document.querySelector('.stop-btn');
const Xmark = document.querySelector('.x-mark');

function printTime() {
    getTimeString();
    $stopwatch.innerText = `${min}:${sec}`;
}

function startClock() {
    isRunning = true;
    timerId = setInterval(() => {
        elapsedTime++;
        printTime();
    }, 1000);
}

function stopClock() {
    isRunning = false;
    clearInterval(timerId);
}

function getTimeString() {
    min = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    sec = String(elapsedTime % 60).padStart(2, '0');
}

Xmark.addEventListener('click', () => {
    if(!isRunning){
        startClock();
    }
    modal.style.visibility = 'hidden';
});

btnPause.addEventListener('click', () => {
    if (isRunning) {
        stopClock();
    }
    modal.style.visibility = 'visible';
});

window.addEventListener('load', startClock);



// 전체 덱
const deck = [
'SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK',
'DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK',
'HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK',
'CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK'
];


// 게임판
const area = {
    area0: ['SA'],
    openIndex0: 0,
    area1: ['D2', 'H2'],
    openIndex1: 1,
    area2: ['C3', 'D3', 'S3'],
    openIndex2: 2,
    area3: ['S4', 'H4', 'D4', 'C4'],
    openIndex3: 3,
    area4: ['H5', 'D5', 'C5', 'S5', 'S6'],
    openIndex4: 4,
    area5: ['C6', 'D6', 'H6', 'S7', 'S8', 'S9'],
    openIndex5: 5,
    area6: ['S10', 'H10', 'D10', 'CJ', 'DJ', 'SK', 'HK'],
    openIndex6: 6
};
 // 푸쉬하면 뒤로 카드가 붙기 때문에 하트2가 앞면이 된다



// 왼쪽 사이드 덱
const LeftDeck = [
    'S2', 'SJ', 'SQ',
    'DA', 'D7', 'D8', 'D9', 'DK',
    'HA', 'H3', 'H5', 'H7', 'H8', 'H9', 'HJ', 'HQ',
    'CA', 'C2', 'C7', 'C8', 'C9', 'C10', 'CQ', 'CK'
];

const openLeftDeck = [];

// 오른쪽 사이드 덱

const SpadeRight = [];
const HeartRight = [];
const CloverRight = [];
const DiamondRight = [];

/* <div class="backward-card-1"><img src="img/backward_orange.svg" alt=""></div>
<div class="forward-card-1"><img src="img/SA.svg" alt=""></div> */

function imgPath(image) {
    return `img/${image}.svg`;
}

function render() {
  for (let i = 0; i < 7; i++) {
    const cardArea = document.querySelector(`.card-area_${i + 1}`);
    if (cardArea) {
      const cards = area['area' + i];
      const openIndex = area['openIndex' + i];
      let temp = '';
        for (let j = 0; j < cards.length; j++) {
          if (j === openIndex) {
            const forwardImagePath = imgPath(cards[j]);
            const forwardClass = `forward-card-${j}`;
            temp += `<div class="${forwardClass}"><img src="${forwardImagePath}"></div>`;
          } else {
            const backwardImagePath = 'img/backward_orange.svg';
            const backwardClass = `backward-card-${j + 1}`;
            temp += `<div class="${backwardClass}"><img src="${backwardImagePath}"></div>`;
          }
        }

        cardArea.innerHTML = temp;
        }
    }
}

render()

// 1. 에리어의 i(포문의 i) 쿼리셀렉터로 가져옴 에리어 0번부터 6번까지 쿼리셀렉터로 셀렉해서 가져옴
// 2. 에리어 i번째 배열을 포문으로 반복해서 엘리먼트 구조 만들어서 어펜드차일드 해주기
// 3. 이중 포문을 함수로 만들어서 랜더함수 안에서 실행하고 전역에서 랜더함수 실행하기