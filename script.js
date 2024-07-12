let game = {

    elBtnClear: null,
    elBtnPlayAgain: null,
    elCurrentScore: null,
    elDeck: null,
    elHiScore: null,
    elWinPanel: null,
    elWinScore: null,
    cardTypes: 10,
    arrCards: [],
    firstCard: null,
    currentScore: 0,
    timer: null,
    showTime: 1000,
    canPlay: true,
    foundPairs: 0,
    hiscore: 0,
    storageName: 'memory-hiscore',
};

function getCardHTML(numeroCarte) {

    let elCard = document.createElement('div');
    elCard.classList.add('card');
    elCard.dataset.id = numeroCarte;

    let innerCard = `<div class="image" style="background-image:url('./carte-memory/carte-${numeroCarte}.jpg')"></div>`;
    innerCard += '<div class="back"></div>';

    elCard.innerHTML = innerCard;

    elCard.addEventListener('click', handlerCardClick);

    return elCard;
}

function shuffleArray(arr) {

    let currentIndex = arr.length - 1;

    while (currentIndex >= 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];

        currentIndex--;
    }
}

function handlerCardClick(evt) {

    let elCard = evt.target.offsetParent;

    if (!game.canPlay) {

        return;
    }

    clearTimeout(game.timer)

    let cardIsNoPlayable = elCard.classList.contains('flipped');

    if (cardIsNoPlayable) {

        return;
    }

    elCard.classList.add('flipped');

    let cardIsFirst = game.firstCard === null;

    if (cardIsFirst) {

        game.firstCard = elCard;

        return;
    }

    game.currentScore++;

    game.elCurrentScore.textContent = game.currentScore

    let cardIsDifferent = elCard.dataset.id !== game.firstCard.dataset.id;

    if (cardIsDifferent) {

        game.canPlay = false

        game.timer = setTimeout(function () {

            elCard.classList.remove('flipped')

            game.firstCard.classList.remove('flipped')

            game.firstCard = null;

            game.canPlay = true;

        }, game.showTime);

        return;
    }

    game.firstCard = null;

    game.foundPairs ++;

    let allFound = game.foundPairs >= game.cardTypes;

    if(!allFound) {

        return;
    }

    wonGame()
}

function initGame() {

    game.elCurrentScore = document.getElementById('the-score-display');
    game.elHiScore = document.getElementById('the-hiscore-display');
    game.elWinScore = document.getElementById('the-win-score-display');

    game.elBtnClear = document.getElementById('the-clear-hiscore-button');
    game.elBtnPlayAgain = document.getElementById('the-play-again-button');

    game.elDeck = document.getElementById('the-deck');
    game.elWinPanel = document.getElementById('the-win-panel')

    game.elBtnClear.addEventListener('click', function () {

        console.log('Record effacer');
        localStorage.removeItem(game.storageName);

        game.hiscore = 0;
        game.elHiScore.textContent = game.hiscore
    });

    game.elBtnPlayAgain.addEventListener('click', function () {

        newGame();
    });

    let storedHiscore = localStorage.getItem(game.storageName);

    if(storedHiscore === null) {

        storedHiscore = 0;
    }
    
    game.hiscore = storedHiscore;
    game.elHiScore.textContent = game.hiscore;

    newGame();
}

function newGame() {

    console.log('Nouvelle partie commencer');

    game.elDeck.innerHTML = '';
    game.arrCards = [];

    game.foundPairs = 0;

    for (let numeroCarte = 1; numeroCarte <= game.cardTypes; numeroCarte++) {

        game.arrCards.push(numeroCarte, numeroCarte);
    }

    shuffleArray(game.arrCards);

    for (let numeroCarte of game.arrCards) {

        let elCard = getCardHTML(numeroCarte);

        game.elDeck.append(elCard);
    }

    game.currentScore = 0;
    game.elCurrentScore.textContent = game.currentScore;

    game.elWinPanel.classList.add('hidden');
    game.elDeck.classList.remove('hidden');
}

function wonGame() {

    game.elWinScore.textContent = game.currentScore;

    if(game.currentScore < game.hiscore || game.hiscore <= 0) {

        game.hiscore = game.currentScore;
        game.elHiScore.textContent = game.hiscore;

        localStorage.setItem(game.storageName, game.hiscore);
    }

    game.elDeck.classList.add('hidden')
    game.elWinPanel.classList.remove('hidden')
}

initGame();