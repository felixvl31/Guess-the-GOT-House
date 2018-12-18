function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

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

var game = {
  houses: [ "stark","arryn","lannister","targaryen","greyjoy","baratheon",
            "martell","tully","tyrell","mormont","karstark","swyft","westerling",
            "allyrion","hornwood","crakehall","cerwyn","mallister","frey","clegane",
            "selmy","dondarrion","seaworth"],
  secretWord: "",
  currentWordDisplay: "",
  currentGuesses: "",
  previousGuess: false,
  wordComplete: false,
  lives: 10,
  gamesWon:0,
  gamesLost:0,
  initialized: false,
  correctGuess: false,
  randomRemove: function(){
      index = Math.floor(Math.random()*this.houses.length);
      this.secretWord = this.houses[index];
      this.houses.splice(index,1);
    } 
}

// Wait on a key to be pressed to run the main logic
document.onkeyup = function doThisOnKeyUp(event){
  // Use this flag to avoid displaying the same letter multiple times
  game.previousGuess = findLetter(game.currentGuesses,event.key);
  game.correctGuess = false;
  
  // Start game when "Enter" is pressed
  if (event.keyCode == 13) {
    instructions.innerHTML = "Try to guess the House";
    document.getElementById("houseSigil").src="assets/images/blank.png";
    game.initialized = true;
    // Select initial word to display
    game.randomRemove();
    // Hide the letters using underscores
    game.currentWordDisplay = game.secretWord.replace(/[a-z]/gi, "_");
    currentWord.innerHTML = game.currentWordDisplay;
    game.currentGuesses = "";
    livesLeft.innerHTML = game.lives;
  }

  if (game.initialized) {
    if (!game.previousGuess) {
      for (i = 0; i < game.secretWord.length; i++) {
        if (game.secretWord[i] == event.key.toLowerCase()) {
          game.correctGuess = true;
          game.currentWordDisplay = replaceAt(game.currentWordDisplay, i, event.key.toLowerCase());
        } 
        else if (i == game.secretWord.length - 1 && !game.correctGuess && isLetter(event.key)) {
          game.currentGuesses += event.key.toLowerCase() + ","; 
          game.lives -= 1;
        }
      }
    }

    currentWord.innerHTML = game.currentWordDisplay;
    wrongGuess.innerHTML = game.currentGuesses;
    livesLeft.innerHTML = game.lives;

    if (game.lives == 0) {
      game.gamesLost += 1;
      document.getElementById("houseSigil").src= "assets/images/"+game.secretWord+ ".jpg";
      alert("The house was " + game.secretWord);
    }

    if (game.currentWordDisplay == game.secretWord) {
      // alert("House guessed!");
      game.wordComplete = true;
      document.getElementById("houseSigil").src= "assets/images/"+game.secretWord+ ".jpg";
      game.gamesWon += 1;
    }

    if (game.wordComplete || game.lives == 0) {
      game.wordComplete = false;
      game.lives = 10;

      if (game.houses.length == 0) {
        currentWord.innerHTML = game.currentWordDisplay;
        alert("Game Complete");
        instructions.innerHTML = "Game Complete";
      }

      if (game.houses.length == 1) {
        alert("Last Word");
      }

      game.initialized = false;
      instructions.innerHTML = "Press ENTER for a new word";    
      wordsGuessed.innerHTML = game.gamesWon;
      wordsMissed.innerHTML = game.gamesLost;
    }
  }
};