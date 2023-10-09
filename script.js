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
const zone1 = ['SA'];
const zone2 = ['D2', 'H2']; // 푸쉬하면 뒤로 카드가 붙기 때문에 하트2가 앞면이 된다
const zone3 = ['C3', 'D3', 'S3'];
const zone4 = ['S4', 'H4', 'D4', 'C4'];
const zone5 = ['H5', 'D5', 'C5', 'S5', 'S6'];
const zone6 = ['C6', 'D6', 'H6', 'S7', 'S8', 'S9'];
const zone7 = ['S10', 'H10', 'D10', 'CJ', 'DJ', 'S7', 'S8', 'S9', 'S10'];

let open1 = 0;
let open2 = 1;
let open3 = 2;
let open4 = 3;
let open5 = 4;
let open6 = 5;
let open7 = 6;

// 왼쪽 사이드 덱
const LeftDeck = [
    'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK',
    'DA', 'D3', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DK',
    'HA', 'H3', 'H4', 'H5', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK',
    'CA', 'C2', 'C4', 'C5', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK'
];

const openLeftDeck = [];

// 오른쪽 사이드 덱

const SpadeRight = [];
const HeartRight = [];
const CloverRight = [];
const DiamondRight = [];

// 처음에 시작할 때 왼쪽에 덱이 오픈되어있지 않고 하나씩or세장씩 오픈되는거라
// 빈 배열 만들고 거기에 푸쉬하는 식으로 만들어야할거같아서 왼쪽에 오픈된 덱은 따로 안 만들었어요

// 오른쪽 사이드 덱은 제가 클릭하거나 드래그 해야 하나씩 쌓이는 구조라 이쪽도 빈배열에 푸쉬로 해야할거 같음