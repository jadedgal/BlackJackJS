var dealerSum = 0;
var playerSum = 0;

var hasStood = false;

var dealerAceCount = 0;
var playerAceCount = 0;

var hidden;
var deck;

var canHit = true;
//--------------------------------------------------------------------------------------------------
window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stand").addEventListener("click", stand);
};
//--------------------------------------------------------------------------------------------------
function buildDeck() {
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}
//--------------------------------------------------------------------------------------------------
function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  //console.log(deck);
}
//--------------------------------------------------------------------------------------------------
function startGame() {
  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  document.getElementById("dealerCards").append(cardImg);

  //console.log("Dealer Sum:" + dealerSum);
  document.getElementById("dealerSum").innerText =
    (dealerSum - getValue(hidden)).toString() + " + Unknown";

  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("playerCards").append(cardImg);
  }
  document.getElementById("playerSum").innerText = playerSum;

  //console.log("Player Sum:" + playerSum);
}
//--------------------------------------------------------------------------------------------------
function hit() {
  if (!canHit) {
    return;
  }

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  playerSum += getValue(card);
  playerAceCount += checkAce(card);
  document.getElementById("playerCards").append(cardImg);

  if (playerSum > 21 && playerAceCount > 0) {
    playerSum = reduceAce(playerSum, playerAceCount);
    playerAceCount--;
  }

  if (playerSum > 21) {
    stand();
  }

  document.getElementById("playerSum").innerText = playerSum;
  //console.log(playerSum, playerAceCount);
}
//--------------------------------------------------------------------------------------------------
function stand() {
  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  let message = "";
  if (playerSum > 21) {
    message = "You Lose, you went bust.";
  } else {
    while (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "./cards/" + card + ".png";
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      dealerSum = reduceAce(dealerSum, dealerAceCount);
      document.getElementById("dealerCards").append(cardImg);
    }

    if (dealerSum > 21) {
      message = "You Win, the dealer went bust and you didn't.";
    } else if (playerSum == dealerSum) {
      message = "Dealer Wins, you tied!";
    } else if (playerSum > dealerSum) {
      message = "You win, you got more than the dealer.";
    } else if (playerSum < dealerSum) {
      message = "You Lose, the dealer got more than you.";
    }
  }

  if (!hasStood) {
    document.getElementById("dealerSum").innerText = dealerSum;
    document.getElementById("results").innerText = message;
    container = document.getElementById("refreshContainer");
    var retryButton = document.createElement("button");
    retryButton.innerText = "Retry";
    retryButton.className = "button";
    retryButton.addEventListener("click", refresh);
    container.appendChild(retryButton);
  }
  hasStood = true;
}

//--------------------------------------------------------------------------------------------------
function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) {
    if (value == "A") {
      return 11;
    }
    return 10;
  }
  return parseInt(value);
}
//--------------------------------------------------------------------------------------------------
function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}
//--------------------------------------------------------------------------------------------------
function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}
//--------------------------------------------------------------------------------------------------
function refresh() {
  location.reload();
}
//--------------------------------------------------------------------------------------------------
