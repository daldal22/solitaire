let timerId;
let isRunning = false;
let elapsedTime = 0;
const $stopwatch = document.querySelector('.timer');
let min, sec;

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

document.querySelector('.play-btn').addEventListener('click', () => {
    if (!isRunning) {
        startClock();
    }
});

document.querySelector('.stop-btn').addEventListener('click', () => {
    if (isRunning) {
        stopClock();
    }
});

window.addEventListener('load', startClock);
// 도큐먼트 쓰면 안되서 최상위 객체 윈도우 썼어요