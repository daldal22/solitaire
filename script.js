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
let deck = [
'SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK',
'DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK',
'HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK',
'CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK'
];


// 게임판
let area = {
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
let leftDeck = [
    'S2', 'SJ', 'SQ',
    'DA', 'D7', 'D8', 'D9', 'DK',
    'HA', 'H3', 'H5', 'H7', 'H8', 'H9', 'HJ', 'HQ',
    'CA', 'C2', 'C7', 'C8', 'C9', 'C10', 'CQ', 'CK'
];

let openLeftDeck = [];

let visibleCard = 0;

// 오른쪽 사이드 덱

let sidePattern = { // 변수 이름 바꾸기
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

function isCardValid(card) {
    if (typeof card !== 'string') return false;

    const suit = card[0];
    const number = card.slice(1);

    if (!['S', 'H', 'D', 'C'].includes(suit) || (!cardNum.includes(number) && number !== '10')) {
        console.log('Invalid card format');
        return false;
    }

    return true;
} // 카드가 유효한지 알아보는 함수

function moveAnswer(card) {
    if (!isCardValid(card)) return;
    const suit = card[0];
    sidePattern[suit].push(card);
}
 // 오른쪽 사이드 부분에 카드 옮기는 함수

 function findHint() {
    let hintFound = false;

    for (let i = 0; i < 7; i++) {
    const currentCard = area['area' + i][area['area' + i].length - 1];
    if (isCardValid(currentCard)) {
    for (let j = 0; j < 7; j++) {
        if (i !== j) {
            const cardJ = area['area' + j][area['area' + j].length - 1];
            if (checkCard(currentCard, cardJ)) {
                console.log('힌트: 다른 에리어로 옮길 수 있음');
                hintFound = true;
                break;
                }
            }
        }
    }
    if (hintFound) {
        break;
        }
    }

    if (!hintFound) {
    console.log('힌트: 현재 위치에서 더 이상 옮길 수 있는 카드가 없음');
    }
}

// 카드에 관한 힌트 서치 필요함
// 왼쪽 사이드 카드에 대한 경우도 필요함
// 카드[j] 필요없음 뒷면 전체도 확인 필요없음
// 카드 하나 선택해서 에리어 돌면서 확인해야함
// 규칙 다시 살펴보기

const hintButton = document.querySelector('.hint-btn');
hintButton.addEventListener('click', findHint);



function shuffleAllDeck() {
    for (let i = 0; i < deck.length; i++) {
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
} // 전체 덱을 섞는 함수

function shareRandomDeck() {
    shuffleAllDeck();

    area = {};
    let startIdx = 0;

    for (let i = 0; i < 7; i++) {
        const endIdx = startIdx + (i + 1);
        area[`area${i}`] = deck.slice(startIdx, endIdx);
        startIdx = endIdx;
    }

    leftDeck = deck.slice(28);
} // 덱 자체를 섞어서 왼쪽 덱이랑 게임판에 나누는 함수


function shuffleLeftDeck(){
    for(let i = 0; i < leftDeck.length; i++){
        const j = Math.floor(Math.random() * leftDeck.length);
        [leftDeck[i], leftDeck[j]] = [leftDeck[j], leftDeck[i]]
    }
} // 왼쪽 카드 섞는 알고리즘

function getBackLeftCard(){
    while(leftDeck.length > 2){
    const threeCards = leftDeck.splice(0,3);
    openLeftDeck.push(...threeCards);
    }
    if(leftDeck.length > 0){
        openLeftDeck.push(...leftDeck);
    }
    leftDeck = openLeftDeck.slice();
    openLeftDeck.length = 0;
} // 오픈한 카드 되돌리는 함수 (3장씩)

/* 
<div class="side-left">
    <div class="left-card-area">
        <div class="side-empty-card"><img src="img/empty_card_refresh.svg" alt=""></div>
        <div class="side-backward-card"><img src="img/backward_orange.svg" alt=""></div>
        <div class="side-forward-card-1"><img src="img/SA.svg" alt=""></div>
        <div class="side-forward-card-2"><img src="img/HA.svg" alt=""></div>
        <div class="side-forward-card-3"><img src="img/CA.svg" alt=""></div>
    </div>
</div>
*/
const $leftDeckArea = document.querySelector('.left-card-area');


function createLeftDeckArea() {
    // 섞기 버튼
    const $emptyCard = document.createElement('div');
    $emptyCard.className = 'side-empty-card';

    const $emptyCardImg = document.createElement('img');
    $emptyCardImg.src = 'img/empty_card_refresh.svg';
    $emptyCard.appendChild($emptyCardImg);

    const $sideBackCard = document.createElement('div');
    $sideBackCard.className = 'side-backward-card';
    const $sideBackImg = document.createElement('img');
    $sideBackImg.src = imgFind('backward_orange');

    $sideBackCard.addEventListener('click', () => {
            if (leftDeck.length > 2) {
                drawThreeCards();
            } else if(leftDeck.length === 0) {
                $sideBackCard.style.visibility = 'hidden';
                $emptyCard.style.visibility = 'visible';
            }
    });

    $emptyCard.addEventListener('click', () => {
        if (openLeftDeck.length > 2) {
            leftDeck = shuffleLeftDeck(openLeftDeck);
            openLeftDeck = [];
            $emptyCard.style.visibility = 'hidden';
            $sideBackCard.style.visibility = 'visible';
        }
    });

    $sideBackCard.appendChild($sideBackImg);
    $leftDeckArea.appendChild($emptyCard);
    $leftDeckArea.appendChild($sideBackCard);
}

function clearLeftDeckArea() {
    const $leftDeckArea = document.querySelector('.left-card-area');
    const $cards = $leftDeckArea.getElementsByClassName('side-forward-card');
    while ($cards.length > 0) {
        $leftDeckArea.removeChild($cards[0]);
    }
}

function drawThreeCards() {
    for (let i = 0; i < 3; i++) {
        if (leftDeck.length > 0) {
            const card = leftDeck.shift();
            openLeftDeck.push(card);
            const $forwardCard = document.createElement('div');
            $forwardCard.className = `side-forward-card-${i + 1}`;
            const $img = document.createElement('img');
            $img.src = imgFind(card);
            $forwardCard.appendChild($img);
            $leftDeckArea.appendChild($forwardCard);
        }
    }
}

// 뽑을 카드 배열이 있어야함 뽑은 카드 배열에서 끝에서 3장이 화면에 보여야 함
// 카드를 새로 뽑거나 맨 끝에 있는 카드를 사용할 때마다 3장을 갱신해야함 3장만 쌓여있을 때 하나 쓰면 2개, 두개 쓰면 1개만 보이게
// 레프트 덱을 클릭했을 때, 뽑은 카드 배열에 3개 카드를 추가함(이 기능 담은 함수 필요함)
// 배열에 추가하는 함수, 마지막 3개 카드를 보이게 업데이트 하는 함수 (덱을 눌렀을때 이 두개 한번에 호출해야함)
// 뽑힌 카드(보이는 3개 카드) 중에서 1장 썼을 때, 배열에 남은 카드들 기준으로 화면 업데이트 해야함(마지막 3개카드 함수 사용)

function dragStart(e) {
    const classList = e.currentTarget.classList;
    const index = classList[0].slice(13);
    const area = classList[1];
    e.dataTransfer.setData('index', index);
    e.dataTransfer.setData('area', area);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();

    const index = e.dataTransfer.getData('index');
    const areaName = e.dataTransfer.getData('area');

    const card = area[areaName][index];

    const endpointElement = e.target;
    const endpointInfo = endpointElement.innerText;

    console.log('Dropped at endpoint:', endpointInfo);
    console.log('Dragged card index:', index);
    console.log('Drag start:', card);
}


function createBoardArea() {
    for (let i = 0; i < 7; i++) {
        const cardArea = document.querySelector(`.card-area_${i}`);
        if (!cardArea) continue;

        const cards = area['area' + i];
        cardArea.innerHTML = '';

        for (let j = 0; j < cards.length; j++) {
            const cardElement = document.createElement('div');
            let imgPath,className
            if(j === cards.length - 1){
                imgPath = imgFind(cards[j]);
                className = `forward-card-${j} area${i}`;
                cardElement.addEventListener('dragstart', dragStart);
            } else{
                imgPath = 'img/backward_orange.svg';
                className = `backward-card-${j} area${i}`;
            }
            cardElement.innerHTML = `<img src="${imgPath}">`;
            cardElement.className = className;

            cardElement.addEventListener('dragover', dragOver);
            cardElement.addEventListener('drop', drop);

            cardArea.appendChild(cardElement);            
        }
    }
} // 게임판 만드는 함수

function render() {
    shareRandomDeck();
    createLeftDeckArea();
    createBoardArea();
}

render();

// 카드 덱을 랜덤으로 섞는 알고리즘
// 되돌리기 버튼 누르면 이전 단계로 돌아가는 알고리즘
// 점수판 점수 올리고 내리는 규칙에 따라 숫자 바뀌는 알고리즘

// 함수는 2가지의 경우가 있음 1. 매개변수 받음 2. 매개변수 안 받음
// 매개변수가 함수 안에서 사용하기 위해서는 타입체크가 필요하다
// 타입 체크 해서 내가 원하지 않은 결과값이 나오면 함수가 실행 되지 않아야 한다(안전장치 만들기)

// 드래그 방식의 어려움 난이도 먼저 구현을 하고 나중에 쉬움은 내가 따로 구현해보는 방식으로 하기

// 드래그 오른쪽으로 했을때 자동으로 가게 만들었으면 좋겠다

// 에리어 0~6까지 모두 확인해서 이동할 수 있으면 힌트 배열에 추가

// 카드 클릭하면 힌트 콘솔로그에 찍기
// 드래그 끝나는 카드(엔드포인트) 좌표값 찾아오기


// 되돌리기 알고리즘:
// 카드를 이동하기 전에 솔리테어 게임판의 배열들을 객체로 저장한다
// 임의로 카드를 옮긴 상태의 배열들을 업데이트객체(가제)로 저장한다
// 되돌리기 버튼을 누르면 카드를 이동하기 전 상태의 객체를 불러온다
// 업데이트 객체를 초기화 한다(빈객체)