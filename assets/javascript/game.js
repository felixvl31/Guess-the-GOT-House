function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function findLetter(string, letter) {
  for (i = 0; i < string.length; i++) {
    if (string[i] == letter) {
      return true;
    }
  }
  return false;
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

//Array of Houses
var Houses = [
  "stark",
  "arryn",
  "lannister",
  "targaryen",
  "greyjoy",
  "baratheon",
  "martell",
  "tully",
  "tyrell",
  "mormont",
  "karstark",
  "swyft",
  "westerling",
  "allyrion",
  "hornwood",
  "crakehall",
  "cerwyn",
  "mallister",
  "frey",
  "clegane",
  "selmy",
  "dondarrion",
  "seaworth"
];

// Select random House and remove it from array
var randomIndex = Math.floor(Math.random() * Houses.length);
var secretWord = Houses[randomIndex];
Houses.splice(randomIndex, 1);

currentWord.innerHTMl = secretWord.replace(/[a-z]/gi, "_");

var currentWordDisplay = currentWord.innerHTMl;
var currentGuesses = wrongGuess.innerHTML;
var wordComplete = false;

var life = 10;
var gamesWon = 0;
var gamesLost = 0;
livesLeft.innerHTML = life;
var displayText = false;

console.log(secretWord);


document.onkeyup = function doThisOnKeyUp(event) {
  var correctGuess = false;
  var previousGuess = findLetter(currentGuesses, event.key);

  wordsGuessed.innerHTML = gamesWon;
  wordsMissed.innerHTML = gamesLost;

  if (event.keyCode == 13 && !displayText) {
    instructions.innerHTML = "Try to guess the House";
    document.getElementById("houseSigil").src="assets/images/blank.png";
    displayText = true;
  }

  if (displayText) {
    if (!previousGuess) {
      for (i = 0; i < secretWord.length; i++) {
        if (secretWord[i] == event.key.toLowerCase()) {
          correctGuess = true;
          currentWordDisplay = replaceAt(currentWordDisplay, i, event.key.toLowerCase());
        } 
        else if (i == secretWord.length - 1 && !correctGuess && isLetter(event.key)) {
          currentGuesses += event.key.toLowerCase() + ","; 
          life -= 1;
        }
      }
    }

    currentWord.innerHTML = currentWordDisplay;
    wrongGuess.innerHTML = currentGuesses;
    livesLeft.innerHTML = life;

    if (life == 0) {
      gamesLost += 1;
      document.getElementById("houseSigil").src= "assets/images/"+secretWord+ ".jpg";
      alert("The house was " + secretWord);
    }

    if (currentWordDisplay == secretWord) {
      // alert("House guessed!");
      wordComplete = true;
      document.getElementById("houseSigil").src= "assets/images/"+secretWord+ ".jpg";
      gamesWon += 1;
    }



    if (wordComplete || life == 0) {
      wordComplete = false;
      life = 10;

      if (Houses.length == 0) {
        alert("Game Complete");
        instructions.innerHTML = "Game Complete";
      }

      if (Houses.length == 1) {
        alert("Last Word");
      }

      randomIndex = Math.floor(Math.random() * Houses.length);
      secretWord = Houses[randomIndex];
      Houses.splice(randomIndex, 1);
      displayText = false;
      instructions.innerHTML = "Press ENTER for a new word";
      currentWord.innerHTML = secretWord.replace(/[a-z]/gi, "_");
      currentWordDisplay = secretWord.replace(/[a-z]/gi, "_");
      currentGuesses = " ";
      correctGuess = false;
      
    }
  }
};
