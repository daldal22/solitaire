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

// 전체 덱
let deck = [
    'SA', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'SJ', 'SQ', 'SK',
    'DA', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'DJ', 'DQ', 'DK',
    'HA', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'HJ', 'HQ', 'HK',
    'CA', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'CJ', 'CQ', 'CK'
    ];

// 왼쪽 사이드 덱
let leftDeck = [
    'S2', 'SJ', 'SQ',
    'DA', 'D7', 'D8', 'D9', 'DK',
    'HA', 'H3', 'H5', 'H7', 'H8', 'H9', 'HJ', 'HQ',
    'CA', 'C2', 'C7', 'C8', 'C9', 'C10', 'CQ', 'CK'
];

let openLeftDeck = [];

let sidePattern = {
    S: '',
    H: '',
    D: '',
    C: ''
}

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

// console.log(checkCard('SA', 'D2'))

function parseColor(card) {
    if (typeof card !== 'string') return;
    if (card[0] === 'H' || card[0] === 'D') return 'R';
    if (card[0] === 'S' || card[0] === 'C') return 'B';
    return '';
} // 카드의 색깔을 판별하는 함수

function isSideValid(card) {
    const suit = card[0];
    const suitPattern = sidePattern[suit];
    const topCard = suitPattern[suitPattern.length - 1];

    if (!topCard) {
        return card.slice(1) === 'A';
    }

    const topCardNum = cardNum.indexOf(topCard);
    const currentCardNum = cardNum.indexOf(card);

    return topCardNum + 1 === currentCardNum;
} // 오른쪽으로 옮겨도 유효한지 판단하는 함수

// console.log(isSideValid('DA'))

function movableLeftDeck(cardIndex, endCard) { // 이름 바꾸기
    const leftDeckArea = document.querySelector('.left-card-area');
    const card = leftDeckArea.querySelector(`.side-forward-card-1`);
    console.log('test1 :', cardIndex);
    console.log('test2 :', endCard)
    console.log('test3 :', openLeftDeck)
    console.log()

    if (card) {
        const movedCard = openLeftDeck.slice(0); // 클릭한거 타겟으로 잡기
        if (checkCard(movedCard, endCard)) {
            console.log(`이동 가능한 카드가 ${cardIndex}로 이동했습니다.`);
        } else {
            console.log('카드 이동이 불가능합니다.');
        }
    }
}

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

console.log('test1 :',area)

function createForwardCardElement(cardNumber, droppedArea, movedCard) {
    const newElement = document.createElement('div');
    newElement.classList.add(`forward-card-${cardNumber}`, `area${droppedArea.slice(4)}`);
    newElement.innerHTML = `<img src="${imgFind(movedCard)}">`;
    return newElement;
}

function updateForwardCard(droppedArea, movedCard, droppedImage, index) {
    const parentClassName = Array.from(droppedImage.parentElement.classList)[0];

    if (!parentClassName || !parentClassName.startsWith('forward-card-')) {
        return; // 아무 작업도 수행하지 않음
    }

    const dragStartCardNumber = parseInt(parentClassName.match(/forward-card-(\d+)/)?.[1]);

    if (dragStartCardNumber === undefined) {
        return; // 아무 작업도 수행하지 않음
    }

    const cardsInDroppedArea = area[droppedArea];
    const isLastCard = index === cardsInDroppedArea.length - 1;

    if (!isLastCard) {
        const newNumber = dragStartCardNumber + 1;
        const newElement = createForwardCardElement(newNumber, droppedArea, movedCard);

        // 새로운 엘리먼트를 현재 드롭한 위치 뒤에 추가
        const droppedElement = document.querySelector(`.forward-card-${dragStartCardNumber}.area${droppedArea.slice(4)}`);
        if (droppedElement) {
            droppedElement.parentElement.insertBefore(newElement, droppedElement.nextSibling);
        }
    }
}

function removeLastAreaElement(areaName) {
    const areaElement = document.querySelector(`.${areaName}:last-child`);
    areaElement.remove();
} // 항상 마지막 요소만 지우게 되는 문제가 있는데 이걸 어떻게 고쳐야할지 아이디어가 안 떠오름


function updateBackwardCard(areaName) {
    const areaElement = document.querySelector(`.${areaName}:last-child`);
    const backwardCardImage = areaElement.querySelector('img');
    backwardCardImage.src = imgFind(area[areaName][area[areaName].length - 1]);

    const classList = areaElement.classList;
    const lastClass = classList[classList.length - 1];
    const backwardCardNumber = lastClass.match(/\d+/)[0];
    areaElement.classList.replace(`backward-card-${backwardCardNumber}`, `forward-card-${backwardCardNumber}`);
}


function drop(e) {
    e.preventDefault();
    console.log('test2 :', area);

    const index = e.dataTransfer.getData('index');
    const areaName = e.dataTransfer.getData('area');
    const droppedImage = e.target;
    const cardImgSrc = droppedImage.getAttribute('src');
    const endCard = cardImgSrc.split('.')[0].slice(4);
    const droppedArea = Array.from(droppedImage.parentElement.classList)[1];

    if (areaName.startsWith('area') && checkCard(area[areaName][index], endCard)) {
        removeLastAreaElement(areaName);
        
        const movedCard = area[areaName].pop();
        area[droppedArea].push(movedCard);
        updateForwardCard(droppedArea, movedCard, droppedImage);
        updateBackwardCard(areaName);

    } else {
        movableLeftDeck(droppedArea, endCard);
    }
}


function shuffleAllDeck() {
    for (let i = 0; i < deck.length; i++) {
        const j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
} // 전체 덱을 섞는 함수

function shareRandomDeck() {
    shuffleAllDeck();

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




function imgFind(image) {
    return `img/${image}.svg`;
} // 이미지 경로 찾는 함수

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
            
            const $sideFirstCard = document.querySelector('.side-forward-card-1');
            if ($sideFirstCard) {
                $sideFirstCard.addEventListener('dragstart', dragStart);
                $sideFirstCard.addEventListener('dragover', dragOver);
                $sideFirstCard.addEventListener('drop', drop);
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
    createBoardArea();
}

render();