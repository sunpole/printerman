let rubas = 0;
let paperInSlot = false;
let gameRunning = true;
let paperInProcess = false;
let hintMessage = "Для начала игры нажмите 'Заказать бумагу'";
let timer = 10;
let paperSlot = document.getElementById('paper-slot');
let printButton = document.getElementById('print-btn');
let orderPaperButton = document.getElementById('order-paper');
let timerDisplay = document.getElementById('timer');
let rubasDisplay = document.getElementById('rubas');
let popup = document.getElementById('popup');
let popupVictor = document.createElement('div');
popupVictor.className = 'popup popup-victor';
let closePopupButton = document.getElementById('close-popup');
let gameOverScreen = document.getElementById('game-over');
let restartButton = document.getElementById('restart-btn');
let paperLot = document.getElementById('paper-lot');
let printedPaper = document.getElementById('printed-paper');
let table = document.getElementById('table');
let paper;
let hint = document.createElement('div');
hint.className = 'hint';
hint.innerText = hintMessage;
document.body.appendChild(hint);
let loadingBar = document.createElement('div');
loadingBar.className = 'loading-bar';
let progressBar = document.createElement('div');
progressBar.className = 'progress';
loadingBar.appendChild(progressBar);
document.querySelector('.printer').appendChild(loadingBar);

// Переменные для контроля интервалов
let lastAppearanceTime = 0;  // Время последнего появления Александра или Виктора
let appearanceInterval = 25000;  // Интервал появления (25 секунд)
let minIntervalBetweenAppearances = 5000;  // Минимальный интервал между появлениями (5 секунд)

// Обновление подсказки
function updateHint(newHint) {
    hint.innerText = newHint;
}

// Заказ бумаги
function orderPaper() {
    if (gameRunning && !paperInSlot) {
        paper = document.createElement('div');
        paper.classList.add('paper');
        paper.style.top = '0px';  // Начальная позиция
        paper.style.left = Math.random() * (paperSlot.offsetWidth - 60) + 'px'; // Случайная позиция
        paperSlot.appendChild(paper);
        paperInSlot = true;
        orderPaperButton.disabled = true;  // Отключаем кнопку, пока идет таймер
        startTimer();
        updateHint("Для печати нажмите 'Печать'");
    }
}

// Таймер для заказа бумаги
function startTimer() {
    if (timer > 0) {
        timer--;
        timerDisplay.innerText = timer;
        setTimeout(startTimer, 1000);
    } else {
        orderPaperButton.disabled = false;
        timer = 10;
        timerDisplay.innerText = timer;
    }
}

// Печать
function printPaper() {
    if (paperInSlot && !paperInProcess) {
        paperInProcess = true;
        let paperPosition = paper.getBoundingClientRect();
        let printerPosition = paperLot.getBoundingClientRect();

        // Двигаем бумагу в лоток
        paper.style.transition = 'all 2s';
        paper.style.top = (printerPosition.top - paperPosition.top + window.scrollY) + 'px';
        paper.style.left = (printerPosition.left - paperPosition.left + window.scrollX) + 'px';

        setTimeout(() => {
            paperLot.appendChild(paper);
            rubas += 10;
            rubasDisplay.innerText = rubas;
            paperInSlot = false;
            progressBar.style.width = '100%';

            setTimeout(() => {
                printedPaper.appendChild(paperLot.children[0]);
                paperLot.innerHTML = '';
                progressBar.style.width = '0%';
                paperInProcess = false;
                updateHint("Для начала игры нажмите 'Заказать бумагу'");
            }, 2000);
        }, 2000);
    }
}

// Появление Александра
function showPopup() {
    popup.style.display = 'block';
    closePopupButton.innerText = "Я НЕ ПРОПУЩУ";
    setTimeout(() => {
        if (popup.style.display === 'block') {
            endGame();
        }
    }, 4000);
}

// Закрытие всплывающего окна
function closePopup() {
    popup.style.display = 'none';
}

// Появление Виктора
function showPopupVictor() {
    if (!popupVictor.parentElement) {  // Создаем popup только если его нет в DOM
        popupVictor.innerHTML = `
            <div class="popup-victor-content">
                <p>${getRandomVictorPhrase()}</p>
                <button class="btn-close" onclick="thankVictor()">Спасибо, Виктор</button>
            </div>`;
        document.body.appendChild(popupVictor);
    }
    popupVictor.style.display = 'block';
}

// Благодарность Виктору
function thankVictor() {
    rubas += 150;
    rubasDisplay.innerText = rubas;
    popupVictor.style.display = 'none';
}

// Случайные фразы Виктора
function getRandomVictorPhrase() {
    const phrases = [
        "А машину калибровали?",
        "Давайте попробуем изменить цвет!",
        "А влажности достаточно?",
        "Вы знаете, что initial density важна перед max density?"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
}

// Конец игры
function endGame() {
    gameRunning = false;
    gameOverScreen.style.display = 'block';
}

// Перезапуск игры
function restartGame() {
    gameRunning = true;
    gameOverScreen.style.display = 'none';
    rubas = 0;
    rubasDisplay.innerText = rubas;
    paperSlot.innerHTML = '';
    paperLot.innerHTML = '';
    printedPaper.innerHTML = '';
    timer = 10;
    timerDisplay.innerText = timer;
    updateHint("Для начала игры нажмите 'Заказать бумагу'");
}

// Функция для проверки, можно ли показывать всплывающее окно
function canShowPopup() {
    let currentTime = Date.now();
    return (currentTime - lastAppearanceTime) >= minIntervalBetweenAppearances;
}

// Интервалы для появления Александра и Виктора
setInterval(() => {
    if (canShowPopup()) {
        let random = Math.random();  // Генерация случайного числа
        if (random < 0.5) {
            showPopup();  // Показываем Александра
        } else {
            showPopupVictor();  // Показываем Виктора
        }
        lastAppearanceTime = Date.now();  // Обновляем время последнего появления
    }
}, 10000);  // Проверка каждые 10 секунд

// Обработчики событий для кнопок
orderPaperButton.addEventListener('click', orderPaper);
printButton.addEventListener('click', printPaper);
closePopupButton.addEventListener('click', closePopup);
restartButton.addEventListener('click', restartGame);
