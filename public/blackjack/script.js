const suits = ['♠', '♥', '♦', '♣'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let gameOver = false;

let balance = 1000000; // Starting with 1 million
let currentBet = 0;

const dealerCardsElement = document.getElementById('dealer-cards');
const playerCardsElement = document.getElementById('player-cards');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const messageElement = document.getElementById('message');
const balanceElement = document.getElementById('balance');
const currentBetElement = document.getElementById('current-bet');
const chipButtons = document.querySelectorAll('.chip');
const clearBetButton = document.getElementById('clear-bet');
const placeBetButton = document.getElementById('place-bet-button');

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard() {
    return deck.pop();
}

function calculateHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aceCount++;
            value += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    while (value > 21 && aceCount > 0) {
        value -= 10;
        aceCount--;
    }

    return value;
}

function calculateVisibleHandValue(hand) {
    if (hand.length === 0) return 0;
    const firstCard = hand[0];
    if (firstCard.value === 'A') return 11;
    if (['K', 'Q', 'J'].includes(firstCard.value)) return 10;
    return parseInt(firstCard.value);
}

function updateScores() {
    if (gameOver) {
        document.getElementById('dealer-score').textContent = calculateHandValue(dealerHand);
    } else {
        document.getElementById('dealer-score').textContent = calculateVisibleHandValue(dealerHand);
    }
    document.getElementById('player-score').textContent = calculateHandValue(playerHand);
}

function renderCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = `${card.value}${card.suit}`;
    cardElement.style.color = ['♥', '♦'].includes(card.suit) ? 'red' : 'black';
    return cardElement;
}

function renderHands() {
    dealerCardsElement.innerHTML = '';
    playerCardsElement.innerHTML = '';

    dealerHand.forEach((card, index) => {
        if (index === 0 || gameOver) {
            dealerCardsElement.appendChild(renderCard(card));
        } else {
            const hiddenCard = document.createElement('div');
            hiddenCard.className = 'card';
            hiddenCard.textContent = '?';
            dealerCardsElement.appendChild(hiddenCard);
        }
    });

    playerHand.forEach(card => {
        playerCardsElement.appendChild(renderCard(card));
    });

    updateScores();
}

function updateBalance() {
    balanceElement.textContent = balance.toLocaleString();
}

function updateCurrentBet() {
    currentBetElement.textContent = currentBet.toLocaleString();
}

function addChip(value) {
    if (balance >= value) {
        currentBet += value;
        balance -= value; // Subtract the chip value from the balance
        updateCurrentBet();
        updateBalance(); // Update the balance display
    } else {
        alert('Not enough balance for this chip!');
    }
}

function clearBet() {
    balance += currentBet; // Return the current bet to the balance
    currentBet = 0;
    updateCurrentBet();
    updateBalance(); // Update the balance display
}

// Update the placeBet function
function placeBet() {
    if (currentBet <= 0) {
        alert('Please place a bet first!');
        return;
    }
    
    // Start the game (bet has already been subtracted from balance)
    startNewGame();
}

// Update the endGame function
function endGame(result) {
    gameOver = true;
    document.getElementById('game-container').classList.add('game-over');
    
    renderHands(); // Show all cards
    
    if (result.includes('You win')) {
        balance += currentBet; // Add the bet amount to balance (win)
    } else if (result.includes('Dealer wins')) {
        balance -= currentBet; // Subtract the bet amount from balance (loss)
    } else if (result.includes('tie')) {
        // Do nothing, keep the current bet as is
    }

    messageElement.textContent = result;
    updateBalance();
    
    // Don't reset the current bet, maintain it for the next game
    updateCurrentBet();
    
    // Enable betting controls
    setTimeout(() => {
        chipButtons.forEach(button => button.disabled = false);
        clearBetButton.disabled = false;
        placeBetButton.disabled = false;
        hitButton.disabled = true;
        standButton.disabled = true;
    }, 2000); // 2 second delay
}

// Update the startNewGame function
function startNewGame() {
    if (balance <= 0) {
        alert('Game over! You\'re out of money. Refreshing the page will reset your balance.');
        return;
    }

    createDeck();
    shuffleDeck();
    playerHand = [dealCard(), dealCard()];
    dealerHand = [dealCard(), dealCard()];
    gameOver = false;
    renderHands();
    hitButton.disabled = false;
    standButton.disabled = false;
    chipButtons.forEach(button => button.disabled = true);
    clearBetButton.disabled = true;
    placeBetButton.disabled = true;
    messageElement.textContent = '';

    // Remove the game-over class if it exists
    document.getElementById('game-container').classList.remove('game-over');
}

function playerHit() {
    playerHand.push(dealCard());
    renderHands();

    if (calculateHandValue(playerHand) > 21) {
        endGame('You busted! Dealer wins.');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playerStand() {
    gameOver = true;
    hitButton.disabled = true;
    standButton.disabled = true;

    // Reveal the dealer's hidden card
    renderHands();
    await sleep(1000);

    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(dealCard());
        renderHands();
        await sleep(1000); // Wait for 1 second between each card draw
    }

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (dealerValue > 21) {
        endGame('Dealer busted! You win!');
    } else if (playerValue > dealerValue) {
        endGame('You win!');
    } else if (playerValue < dealerValue) {
        endGame('Dealer wins!');
    } else {
        endGame('It\'s a tie!');
    }
}

// Event listeners
chipButtons.forEach(button => {
    button.addEventListener('click', () => addChip(parseInt(button.dataset.value)));
});
clearBetButton.addEventListener('click', clearBet);
placeBetButton.addEventListener('click', placeBet);
hitButton.addEventListener('click', playerHit);
standButton.addEventListener('click', playerStand);

updateBalance();
updateCurrentBet();