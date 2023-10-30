import area from "script/module/area.js"
import deck from "script/module/deck.js"
import { leftDeck, openLeftDeck } from "script/module/leftSide.js"
import sidePattern from "script/module/rightSide.js"

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



function imgFind(image) {
    return `img/${image}.svg`;
} // 이미지 경로 찾는 함수

const cardNum = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];


function checkCard(card1, card2){
    if(typeof card1 !== 'string' || typeof card2 !== 'string') return;

    if(parseColor(card1) === parseColor(card2)) return false;
    
    const card1Num = cardNum.indexOf(card1.slice(1))
    const card2Num = cardNum.indexOf(card2.slice(1))
    if (card2Num - card1Num !== 1) {
        // console.log('Number check failed:', card1, card2);
        return false;
    }
    return true;
} // 카드가 해당 위치에 있어도 되는지 확인하는 함수

function parseColor(card) {
    if (typeof card !== 'string') return;
    if (card[0] === 'H' || card[0] === 'D') return 'R';
    if (card[0] === 'S' || card[0] === 'C') return 'B';
    return '';
} // 카드의 색깔을 판별하는 함수

function isSideValid(card) {
    const suit = card[0];

    const topCard = sidePattern[suit][sidePattern[suit].length - 1];

    if (!topCard) {
        return card.slice(1) === 'A';
    }

    const topCardNum = cardNum.indexOf(topCard);
    const currentCardNum = cardNum.indexOf(card);

    return topCardNum + 1 === currentCardNum;
} // 오른쪽으로 옮겨도 유효한지 판단하는 함수


function moveAnswer(card) {
    const suit = card[0];
    const cardNumber = card.slice(1);

    const cardIndex = cardNum.indexOf(cardNumber);
    const prevIndex = cardIndex - 1;

    if (prevIndex >= 0) {
        const prevCardNum = cardNum[prevIndex];
        const prevCard = suit + prevCardNum;

        if (sidePattern[suit].includes(prevCard)) {
            const cardIndexInSidePattern = sidePattern[suit].indexOf(prevCard);
            sidePattern[suit].splice(cardIndexInSidePattern, 1);
            card = prevCard;

            if (isGeneralBoard(areaName)) updateImageElement(suit);
        }
    }
} // 오른쪽 사이드 부분에 카드 옮기는 함수

function checkHint() {
    const deck = makeMovableDeck();
    const hint = [];
    for (let card of deck) {
        if (isSideValid(card)) {
            hint.push([card]);
        }
    }
    for (let startCard of deck) {
        for (let endCard of deck) {
            if (startCard === endCard) continue;
            if (checkCard(startCard, endCard)) hint.push([startCard, endCard]);
        }
    }
    console.log('힌트 배열:', hint);
}


function makeMovableDeck() {
    const deck = [];
    deck.push(area.area0[area.area0.length-1])
    deck.push(area.area1[area.area1.length-1])
    deck.push(area.area2[area.area2.length-1])
    deck.push(area.area3[area.area3.length-1])
    deck.push(area.area4[area.area4.length-1])
    deck.push(area.area5[area.area5.length-1])
    deck.push(area.area6[area.area6.length-1])
    console.log(deck)
    return deck;
}



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

function clearLeftDeckArea() {
    const $leftDeckArea = document.querySelector('.left-card-area');
    const $cards = $leftDeckArea.querySelectorAll('[class^="side-forward-card"]');

    const temp = [];

    for (let i = 0; i < $cards.length; i++) {
        $leftDeckArea.removeChild($cards[i]);
        temp.push(i);
    }

    for (let i = temp.length - 1; i >= 0; i--) {
        openLeftDeck.splice(temp[i], 1);
    }
} // 레프트덱 초기화

function drawThreeCards() {
    for (let i = 0; i < 3; i++) {
        if (leftDeck.length > 0) {
            const card = leftDeck.shift();
            openLeftDeck.push(card);

            const existingElement = $leftDeckArea.querySelector(`.side-forward-card-${i + 1}`);
            if (existingElement) {
                existingElement.remove();
            }

            const $forwardCard = document.createElement('div');
            $forwardCard.className = `side-forward-card-${i + 1}`;
            const $img = document.createElement('img');
            $img.src = imgFind(card);
            $forwardCard.appendChild($img);
            $leftDeckArea.appendChild($forwardCard);
        }
    }
} // 카드 뽑기


function dragStart(e) {
    const classList = e.currentTarget.classList;
    const index = classList[0].slice(13);
    const area = classList[1];
    e.dataTransfer.setData('index', index);
    e.dataTransfer.setData('area', area);
    e.dataTransfer.setData('class', classList[0]);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();

    const index = e.dataTransfer.getData('index');
    const areaName = e.dataTransfer.getData('area');
    const className = e.dataTransfer.getData('class');

    const droppedImage = e.target;
    const startCard = area[areaName][index];

    const cardImgSrc = droppedImage.getAttribute('src');
    const endCard = cardImgSrc.split('.')[0].slice(4);

    if (className.includes('side-right')) {
        handleSideRightDrop(endCard);
    } else if (isGeneralBoard(areaName)) {
        handleGeneralBoardDrop(endCard, areaName, index);
        updateCardElement(endCard, areaName, areaName);
    } else {
        if (startCard === endCard) return;
        if (className.includes('side-left')) return;
    }
    // console.log(className)    
}

function updateCardElement(card, newArea) {
    const newAreaElement = document.querySelector(`.${newArea}`);

    if (newAreaElement) {
        const newCards = area[newArea];
        newCards.push(card);

        const newIndex = newCards.length + 1;

        const newCardElement = document.createElement("div");
        newCardElement.className = `forward-card-${newIndex} ${newArea}`;
        newCardElement.innerHTML = `<img src="img/${card}.svg">`;
        newAreaElement.appendChild(newCardElement);
    }
}


function handleGeneralBoardDrop(endCard, areaName, index) {
    const startCard = area[areaName][index];
    const isValidMove = checkCard(endCard, startCard);

    if (isValidMove) {
        area[areaName].push(endCard);
        updateCardElement(endCard, areaName, areaName);
        moveAnswer(endCard);
    } else return;
}


function handleSideRightDrop(endCard) {
    if (isSideValid(endCard)) {
        const suit = endCard[0];
        sidePattern[suit] = endCard;
        updateImageElement(suit);

    if (isGeneralBoard(areaName)) {
        const areaNumber = extractAreaNumber(areaName);
        if (areaNumber !== -1) {
            const targetAreaIndex = areaNumber;
            const isValidMove = checkCard(endCard, area[targetAreaIndex][area[targetAreaIndex].length - 1]);

            if (isValidMove) {
                area[targetAreaIndex].push(endCard);
                area[extractAreaNumber(areaName)].splice(index, 1);
                console.log("카드 이동에 성공!");
            } else {
                console.log("카드 이동 실패: 맞지 않는 로직");
            }
        }
    }
    }
}


function isGeneralBoard(areaName) {
    const areaNumber = extractAreaNumber(areaName);
    return areaNumber >= 0 && areaNumber <= 6;
}

function extractAreaNumber(areaName) {
    const areaNumberMatch = areaName.match(/area(\d+)/);
    if (areaNumberMatch) {
        return parseInt(areaNumberMatch[1]);
    }
    return -1;
} 

// if (){
//     // 사이드에 옮겼을 때 로직
// }// 일반에 드래그 했는지 사이드에 했는지부터 체크
// else {
//     // 사이드가 아닌 곳에 옮김
//     // 만약에 스타트카드랑 엔드가 똑같다면 리턴해야함
//     // 에리어에 있는 카드를 왼쪽 사이드 오픈된 카드에 옮겼을 때 리턴
//     // 그 다음에 체크카드 로직 들어가야함

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
            
            // console.log('openLeftDeck:', openLeftDeck);
    });

    $emptyCard.addEventListener('click', () => {
        if (openLeftDeck.length > 2) {
            getBackLeftCard();
            clearLeftDeckArea();
            shuffleLeftDeck();
            $emptyCard.style.visibility = 'hidden';
            $sideBackCard.style.visibility = 'visible';
        }
    });

    $sideBackCard.appendChild($sideBackImg);
    $leftDeckArea.appendChild($emptyCard);
    $leftDeckArea.appendChild($sideBackCard);
}

const $sidePatternArea = document.querySelector('.side-right');

function createSidePatternArea() {
    const suits = ['heart', 'diamond', 'clover', 'spade'];

    suits.forEach(suit => {
        const defaultImage = setDefaultImage(suit);
        updateImageElement(suit, defaultImage);

        const $imageElement = document.querySelector(`.${suit}-card img`);
        $imageElement.addEventListener('dragover', dragOver);
        $imageElement.addEventListener('drop', drop);
    });
}

function updateImageElement(suit, imageSrc) {
    const $imageElement = document.querySelector(`.${suit}-card img`);
    $imageElement.src = imageSrc;
}

function setDefaultImage(suit) {
    return `img/empty_card_${suit}.svg`;
}

function createSideBtnArea(){
    const $hintBtn = document.querySelector('.fa-lightbulb')
    $hintBtn.addEventListener('click', checkHint)
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
    
}

 // 게임판 만드는 함수

function render() {
    shareRandomDeck();
    createLeftDeckArea();
    createSidePatternArea();
    createSideBtnArea();
    createBoardArea();
}

render();

// 되돌리기 버튼 누르면 이전 단계로 돌아가는 알고리즘
// 점수판 점수 올리고 내리는 규칙에 따라 숫자 바뀌는 알고리즘

// 함수는 2가지의 경우가 있음 1. 매개변수 받음 2. 매개변수 안 받음
// 매개변수가 함수 안에서 사용하기 위해서는 타입체크가 필요하다
// 타입 체크 해서 내가 원하지 않은 결과값이 나오면 함수가 실행 되지 않아야 한다(안전장치 만들기)

// 드래그 방식의 어려움 난이도 먼저 구현을 하고 나중에 쉬움은 내가 따로 구현해보는 방식으로 하기

// 드래그 오른쪽으로 했을때 자동으로 가게 만들었으면 좋겠다

// 에리어 0~6까지 모두 확인해서 이동할 수 있으면 힌트 배열에 추가

// 되돌리기 알고리즘:
// 빈 스택을 하나 생성한다
// 객체 하나 만들어서 그 안에 현재 게임판의 정보를 담는다. 스택에 푸쉬해둔다
// 되돌리기 버튼 누르면 뒤에 요소 pop하고 객체 안에 담겨있는 요소들 업데이트 해준다

// 왼쪽 덱 드래그 구현하기
// 왼쪽 덱 엘리먼트 3개만 보여주기 리셋하고 3개만 보이기
// 섞기 버튼 나오면 아래 오픈레프트덱 엘리먼트를 없애기 이너html = ''
// 드래그 할 때 옮겨지는지 안 옮겨지는지 체크하고 붙이는거 구현하기
// 오른쪽 영역에 옮겼을때 옮겨지는지 확인하고 맞으면 붙이기

// 변수 선언한거(배열, 객체) 구조 만들어오기 따로 파일 빼서 (모듈화)
// 고칠거 고쳐오기