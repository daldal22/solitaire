// 타이머

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

// 점수판



// 게임판
let area = {
    area0: ['H5'],
    openIndex0: 0,
    area1: [],
    openIndex1: 1,
    area2: [],
    openIndex2: 2,
    area3: [],
    openIndex3: 3,
    area4: [],
    openIndex4: 4,
    area5: [],
    openIndex5: 5,
    area6: [],
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
    'S2','D3','C4','HA'
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
    const suitPattern = sidePattern[suit];
    const topCard = suitPattern[suitPattern.length - 1];

    if (!topCard) {
        return card.slice(1) === 'A';
    }

    const topCardNum = cardNum.indexOf(topCard);
    const currentCardNum = cardNum.indexOf(card.slice(1));

    return topCardNum + 1 === currentCardNum;
} // 오른쪽으로 옮겨도 유효한지 판단하는 함수

// console.log(isSideValid('DA'))



function dragStart(e) {
    const classList = e.currentTarget.classList;
    const index = classList[0].slice(13);
    const area = classList[1];
    const card = e.target;
    let cardImgSrc = card.getAttribute('src');
    const dragStartCard = cardImgSrc.split('.')[0].slice(4);
    e.dataTransfer.setData('dragStart', dragStartCard);
    e.dataTransfer.setData('index', index);
    e.dataTransfer.setData('area', area);
}


function dragOver(e) {
    e.preventDefault();
}

console.log('test1 :',area)

function movableLeftDeck(droppedArea, endCard) {
    // const leftDeckArea = document.querySelector('.left-card-area');
    // const sideForwardCard = leftDeckArea.querySelector('.side-forward-card-3 img');
    // 밑으로 카드 내려오는 것들 고치기 그냥 그 자리에..
    const lastCard = openLeftDeck[openLeftDeck.length - 1];
    console.log('openLeftDeck',openLeftDeck)
    if (checkCard(lastCard, endCard)) {
        const movedCard = lastCard;
        area[droppedArea].push(movedCard);
        openLeftDeck.pop();
        updateSideForwardCard();
        updateBoard();
    } else if (isSideValid(lastCard)) {
        const suit = lastCard[0];
        const cardNumber = lastCard.slice(1);
        movableAnswerDeck(suit, cardNumber);
        openLeftDeck.pop();
        updateSideForwardCard();

        console.log('레프트덱', openLeftDeck);
    } else {
        return;
    }
}

function updateSideForwardCard() {
    const sideForwardCard3 = document.querySelector('.side-forward-card-3 img');
    const sideForwardCard2 = document.querySelector('.side-forward-card-2 img');
    const sideForwardCard1 = document.querySelector('.side-forward-card-1 img');
    const sideCard3 = openLeftDeck[openLeftDeck.length - 1];
    const sideCard2 = openLeftDeck[openLeftDeck.length - 2];
    const sideCard1 = openLeftDeck[openLeftDeck.length - 3];
    sideForwardCard3.src = `img/${sideCard3}.svg`;
    sideForwardCard2.src = `img/${sideCard2}.svg`;
    sideForwardCard1.src = `img/${sideCard1}.svg`;
    
    // if (sideCard1 === undefined) {
    //     sideForwardCard1.remove();
    // }
    // if (sideCard2 === undefined) {
    //     sideForwardCard2.remove();
    // }
    // if (sideCard3 === undefined) {
    //     sideForwardCard3.remove();
    // }

    // 전체 초기화(이너html'') 한다음에 마지막 카드 최대 3장을 리렌더 하기
    // 리무브 쓰면 안됨
}


function movableAnswerDeck(suit, cardNumber){
    const pattern = ['heart', 'diamond', 'clover', 'spade'];
    switch (suit.toLowerCase()) {
        case 'h':
            suit = 'heart';
            break;
        case 'd':
            suit = 'diamond';
            break;
        case 'c':
            suit = 'clover';
            break;
        case 's':
            suit = 'spade';
            break;
    }

    if (!pattern.includes(suit)) {
        console.log(`Invalid suit: ${suit}`);
        return;
    }

    const sideCardElement = document.querySelector(`.${suit}-card img`);
    const imagePath = imgFind(`${suit.toUpperCase()[0]}${cardNumber}`);
    if (sideCardElement) {
        sideCardElement.setAttribute('src', imagePath);
        sidePattern[suit.toUpperCase()[0]] = `${suit.toUpperCase()[0]}${cardNumber}`;
    }
}

function drop(e) {
    e.preventDefault();
    console.log('test2:', area);

    const index = e.dataTransfer.getData('index');
    const areaName = e.dataTransfer.getData('area');
    const droppedImage = e.target;
    const cardImgSrc = droppedImage.getAttribute('src');
    const endCard = cardImgSrc.split('.')[0].slice(4);
    const droppedArea = Array.from(droppedImage.parentElement.classList)[1];
    console.log(area[droppedArea])
    
    const dragStartCard = e.dataTransfer.getData('dragStart');

    if (areaName.startsWith('area') && !areaName.includes('forward-card') && dragStartCard[1] === 'K') {
        area[droppedArea].push(areaName);
    }
    if (areaName.startsWith('area') && checkCard(area[areaName][index], endCard)) {
        const movedCards = getSubForwardCard(areaName, index);
        movedCards.forEach((card) => {
            area[droppedArea].push(card);
        });
    } else if (areaName.startsWith('area') && isSideValid(dragStartCard)) {
        area[areaName].pop();
        const suit = dragStartCard[0];
        const cardNumber = dragStartCard.slice(1);
        movableAnswerDeck(suit, cardNumber);
        console.log(sidePattern)
    } else {
        movableLeftDeck(droppedArea, endCard);
    }
    render();
}

function getSubForwardCard(areaName, index) {
    const movedCards = area[areaName].slice(index);
    area[areaName] = area[areaName].slice(0, index); // 원래의 area 배열 업데이트
    return movedCards;
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
        const endIdx = startIdx + i + 1;
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
                continue;
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
            if (leftDeck.length > 0) {
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

function createRightDeckArea(){
    const $heart = document.querySelector('.heart-card');
    const $diamond = document.querySelector('.diamond-card');
    const $clover = document.querySelector('.clover-card');
    const $spade = document.querySelector('.spade-card');

    $heart.addEventListener('dragstart', dragStart);
    $heart.addEventListener('dragover', dragOver);
    $heart.addEventListener('drop', drop);

    $diamond.addEventListener('dragstart', dragStart);
    $diamond.addEventListener('dragover', dragOver);
    $diamond.addEventListener('drop', drop);

    $clover.addEventListener('dragstart', dragStart);
    $clover.addEventListener('dragover', dragOver);
    $clover.addEventListener('drop', drop);

    $spade.addEventListener('dragstart', dragStart);
    $spade.addEventListener('dragover', dragOver);
    $spade.addEventListener('drop', drop);

}

function createBoardArea() {
    for (let i = 0; i < 7; i++) {
        const cardArea = document.querySelector(`.card-area_${i}`);
        if (!cardArea) continue;

        const cards = area['area' + i];
        cardArea.innerHTML = '';
        const openIndex = area['openIndex' + i];

        cardArea.innerHTML = '';

        for (let j = 0; j < cards.length; j++) {
            const cardElement = document.createElement('div');
            let imgPath, className;

            if (j < openIndex) {
                imgPath = 'img/backward_orange.svg';
                className = `backward-card-${j} area${i}`;
            } else {
                imgPath = imgFind(cards[j]);
                className = `forward-card-${j} area${i}`;
                cardElement.addEventListener('dragstart', dragStart);
            }

            cardElement.innerHTML = `<img src="${imgPath}">`;
            cardElement.className = className;

            cardElement.addEventListener('dragover', dragOver);
            cardElement.addEventListener('drop', drop);

            cardArea.appendChild(cardElement);
        }
    }
} // 게임판 만드는 함수

function updateBoard() {
    for (let i = 0; i < 7; i++) {
        const cardArea = document.querySelector(`.card-area_${i}`);
        if (!cardArea) continue;

        const cards = area['area' + i];
        const openIndex = area['openIndex' + i];

        cardArea.innerHTML = '';


        cardArea.addEventListener('dragover', dragOver);
        cardArea.addEventListener('drop', drop);

        for (let j = 0; j < cards.length; j++) {
            const cardElement = document.createElement('div');
            let imgPath, className;

            if (openIndex >= cards.length) {
                const isForwardCard = cards[j].includes("forward-card"); // 이거 자체가 말도 안 된다
                if (isForwardCard) {
                    imgPath = imgFind(cards[j]);
                    className = `forward-card-${j} area${i}`;
                    cardElement.addEventListener('dragstart', dragStart);
                } else {
                    imgPath = 'img/backward_orange.svg';
                    className = `backward-card-${j} area${i}`;
                }

                if (j === cards.length - 1 && cards[j][1] === 'K') {
                    imgPath = imgFind(cards[j]);
                    className = `forward-card-${j} area${i}`;
                    cardArea.addEventListener('dragstart', dragStart);
                }
                
            }
            else if (j < openIndex) {
                imgPath = 'img/backward_orange.svg';
                className = `backward-card-${j} area${i}`;
            }
            else {
                imgPath = imgFind(cards[j]);
                className = `forward-card-${j} area${i}`;
                cardElement.addEventListener('dragstart', dragStart);
            }

            if (j === cards.length - 1 && !cards.includes(`forward-card-${j}`)) {
                imgPath = imgFind(cards[j]);
                className = `forward-card-${j} area${i}`;
                cardElement.addEventListener('dragstart', dragStart);
            }

            cardElement.innerHTML = `<img src="${imgPath}">`;
            cardElement.className = className;

            cardElement.addEventListener('dragover', dragOver);
            cardElement.addEventListener('drop', drop);

            cardArea.appendChild(cardElement);
        }
    }
}

function render() {
    updateBoard();
    createLeftDeckArea();
    createRightDeckArea();
}

render();
// shareRandomDeck();
createBoardArea();

// 에리어를 새로 랜더하는게 더 안전하다
// 객체가 새로 업데이트 되었으니까 이거 기준으로 랜더를 새로하기
// 새로 랜더하는 함수 만들기... 카드 옮길 때마다 랜더해야함
// 크리에이트보드에리어를 계속 호출?? 업데이트할 때마다 랜더해야함
// 크리에이트보드에리어 고치기 기존에 있던 forward-card-숫자는 유지해야함

// 스코어 올리는거랑 오른쪽에 옮기는거 해오기
// 크리에이트 보드랑 인덱스가 같은지 비교하고 아니면 포워드 카드 추가하는 식으로
// 랜더를 새로 만들기
// 왼쪽 오픈레프트덱 엘리먼트를 아예 리렌더 하는 방식으로 만들기(클래스 유동적으로 바뀌어야함 이미지 드롭될때마다 바뀜)



// 카드엘리먼트 말고 에리어에 드롭해도 되게 만들기 그래야지 빈 에리어에 카드 넣을 수 있음
// >> 드롭 함수도 고쳤고 업데이트 보드도 고쳤는데 안 돌아감
// 오픈인덱스 문제 해결하기

// 이미지를 히든으로 하나 깔아두기 백워드-0 위치에 / 이미지 걸어서 할거니까 에리어에 이벤트 거는거 필요 없음