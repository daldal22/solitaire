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

const sidePattern = { // 변수 이름 바꾸기
    S: [],
    H: [],
    D: [],
    C: []
}

/* <div class="backward-card-1"><img src="img/backward_orange.svg" alt=""></div>
<div class="forward-card-1"><img src="img/SA.svg" alt=""></div> */

function imgFind(image) {
    return `img/${image}.svg`;
} // 이미지 경로 찾는 함수

const cardNum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function checkCard(card1, card2){
    if(typeof card1 !== 'string' || typeof card2 !== 'string') return;

    if(parseColor(card1) === parseColor(card2)) return false;
    
    const card1Num = cardNum.indexOf(card1.slice(1))
    const card2Num = cardNum.indexOf(card2.slice(1))
    if(card2Num - card1Num !== 1) return false;
    return true;
} // 카드가 해당 위치에 있어도 되는지 확인하는 함수

function parseColor(card){
    if(typeof card !== 'string') return;
    if(card[0] === 'H' || card[0] === 'D') return 'R';
    if(card[0] === 'S' || card[0] === 'C') return 'B';
} // 카드의 색깔을 판별하는 함수

function solveGame(card) {
    if (typeof card !== 'string') return;

    const rightDeck = sidePattern[card[0]] // 문양
    const lastNum = rightDeck[rightDeck.length -1].slice(1);

    if(!cardNum.includes(lastNum)) return false;
    if(card[0] === 'K' && card[0] !== 'A') return false;

    const currentIndex = cardNum.indexOf(lastNum);
    const cardIndex = cardNum.indexOf(card.slice(1));
    
    return cardIndex === (currentIndex + 1) % cardNum.length;
} // 오른쪽 사이드 부분에 카드 옮겼을 때 유효한지 판별하는 함수

function shuffleAllDeck(){
    for(let i = 0; i < deck.length; i++){
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }
} // 전체 덱 섞는 함수
// shuffleAllDeck()
// console.log(deck)

function shareRandomDeck(){
    shuffleAllDeck();

    const randomBoard = deck.slice(0, 28)
    const randomLeftDeck = deck.slice(28)

    area = randomBoard;
    LeftDeck = randomLeftDeck;
}


function shuffleLeftDeck(){
    for(let i = 0; i < LeftDeck.length; i++){
        const j = Math.floor(Math.random() * LeftDeck.length);
        [LeftDeck[i], LeftDeck[j]] = [LeftDeck[j], LeftDeck[i]]
    }
} // 왼쪽 카드 섞는 알고리즘

function getBackLeftCard(){
    while(openLeftDeck.length){
        openLeftDeck.pop();
    }
} // 오픈한 카드 되돌리는 함수 (쉬움)
// pop을 쓰면 뒤에 거가 빠짐 그리고 어떤 값이 반환된다
// 팝 쓰지 말기
// openLeftDeck을 LeftDeck에 할당하고 openLeftDeck을 비우기
// 그 담에 레프트덱을 셔플해주기
// 뽑는거 구현하기

// 왼쪽 사이드 부분 구현하기 3개짜리로 구현하기 클릭이벤트 넣어서

function createBoardArea(){
    shareRandomDeck();

    for (let i = 0; i < 7; i++) {
        const cardArea = document.querySelector(`.card-area_${i}`);
        if(!cardArea) continue;
        
        const cards = area['area' + i];
        const openIndex = area['openIndex' + i];
        let temp = '';

        for (let j = 0; j < cards.length; j++) {
          if (j >= openIndex) {
            const forwardImagePath = imgFind(cards[j]);
            const forwardClass = `forward-card-${j}`;
            temp += `<div class="${forwardClass} area${i}"><img src="${forwardImagePath}"></div>`;
          } else {
            const backwardImagePath = 'img/backward_orange.svg';
            const backwardClass = `backward-card-${j}`;
            temp += `<div class="${backwardClass} area${i}"><img src="${backwardImagePath}"></div>`;
          }
        }
        cardArea.innerHTML = temp;
    }
} // 게임판 만드는 함수

function render() {
    createBoardArea();
}

render();

// 오른쪽 사이드에 카드를 놓았을 때 들어가도 되는지 아닌지 확인하는 알고리즘 (숙제)
// 왼쪽 카드덱에서 카드가 모두 떨어졌을때 오픈된 카드들(왼쪽 사이드 하단) 회수해서 섞는 알고리즘 (숙제)

// 카드 덱을 랜덤으로 섞는 알고리즘
// 게임판 내에서 카드가 해당 위치에 들어가도 되는지 확인하는 알고리즘 (했음)
// 되돌리기 버튼 누르면 이전 단계로 돌아가는 알고리즘
// 점수판 점수 올리고 내리는 규칙에 따라 숫자 바뀌는 알고리즘

// 함수는 2가지의 경우가 있음 1. 매개변수 받음 2. 매개변수 안 받음
// 매개변수가 함수 안에서 사용하기 위해서는 타입체크가 필요하다
// 타입 체크 해서 내가 원하지 않은 결과값이 나오면 함수가 실행 되지 않아야 한다(안전장치 만들기)

// 드래그 방식의 어려움 난이도 먼저 구현을 하고 나중에 쉬움은 내가 따로 구현해보는 방식으로 하기

// 힌트 만드는 알고리즘 생각해오기
// 전체 덱 섞어서 게임판에 놓는 알고리즘 생각해오기 섞기/게임판에 놓기 따로...
// 왼쪽 사이드 부분 구현 해오기
// 드래그 오른쪽으로 했을때 자동으로 가게 만들었으면 좋겠다