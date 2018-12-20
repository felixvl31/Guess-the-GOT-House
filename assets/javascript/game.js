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
  soundRight:document.getElementById("soundRight"),
  soundFail:document.getElementById("soundFail"),
  soundEnd:document.getElementById("soundEnd"),
  continue: false,
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

  // Start game when a key is pressed
  if (event.keyCode !== (-1) && !game.initialized) {
    // Update instructions and blank image
    instructions.innerHTML = "Try to guess the House";
    document.getElementById("houseSigil").src="assets/images/blank.png";
    document.getElementById("image").style.border= "none";
    // Initiliaze game display
    game.initialized = true;
    // Select initial word to display
    game.randomRemove();
    // Hide the letters using underscores
    game.currentWordDisplay = game.secretWord.replace(/[a-z]/gi, "_");
    // Update display with underscores
    currentWord.innerHTML = game.currentWordDisplay;
    // Remove previous guesses
    game.currentGuesses = "";
    // Update Lives
    livesLeft.innerHTML = game.lives;
  }

 
  if (game.initialized) {                                     // Start the game if the variable is true, for this any key has to be pressed prior
    if (!game.previousGuess) {                                // Verify that the user is not trying to enter an already entered key
      for (i = 0; i < game.secretWord.length; i++) {          // Check the length of the secret word and compare every single character with the key pressed
        if (game.secretWord[i] == event.key.toLowerCase()) {                                          //Convert the key to LowerCase
          game.correctGuess = true;                                                                   //Flag to know that the entered key matches
          game.currentWordDisplay = replaceAt(game.currentWordDisplay, i, event.key.toLowerCase());   //Replace the key in the underscored secretword
        } 
        else if (i == game.secretWord.length - 1 && !game.correctGuess && isLetter(event.key)) {      //Check that is not a previously correct letter and that it is actually a letter
          game.currentGuesses += event.key.toLowerCase() + ",";                                       //Add the LowerCase key to the wrong letter  
          game.lives -= 1;                                                                            //Decrease one life
        }
      }
    }
    currentWord.innerHTML = game.currentWordDisplay;                                             // Update displays                                
    wrongGuess.innerHTML = game.currentGuesses;
    livesLeft.innerHTML = game.lives;
    
    if (game.lives == 0) {                                                                       //Verify if the user already lost all lives 
      game.gamesLost += 1;                                                                       //Increase a Lost to the overall Missed score
      if (game.houses.length > 0){
      game.soundFail.volume = 0.1;                                                               //Decrease volume
      game.soundFail.play();                                                                     //Play sound
      }
      document.getElementById("houseSigil").src= "assets/images/"+game.secretWord+ ".jpg";       //Display house sigil
      document.getElementById("image").style.border= "#c32536 groove 10px";                      //Add border to the house sigil
      setTimeout(function() { alert("The house was " + game.secretWord); },100);                 //Pop a delayed alert with the correct answer
    }

    if (game.currentWordDisplay == game.secretWord) {                                            //Verify is the current word display matches the secretWord     
      game.gamesWon += 1;                                                                        //Increase a Lost to the overall Guessed score
      if (game.houses.length > 0){
      game.soundRight.volume = 0.1;                                                              //Decrease volume
      game.soundRight.play();                                                                    //Play sound
      }                                                                  
      game.wordComplete = true;                                                                  //Flag to know that the user completed one word 
      document.getElementById("houseSigil").src= "assets/images/"+game.secretWord+ ".jpg";       //Display house sigil
      document.getElementById("image").style.border= "#c32536 groove 10px";                      //Add border to the house sigil
      setTimeout(function() { alert("House guessed!"); },100);                                   //Pop a delayed alert with the correct answer
    }

    if (game.wordComplete || game.lives == 0) {                                                   //Verify if the user completed a word or lost all lives
      game.wordComplete = false;                                                                  //Remove flag
      game.lives = 10;                                                                            //Reset Lives
      instructions.innerHTML = "Press any key for a new word";                                    //Update instructions

      if (game.houses.length == 1) {                                                              //Verify if the array has one word left
        setTimeout(function() { alert("Last Word"); },150);                                       //Alert the user that next will be last word
      }

      if (game.houses.length == 0) {                                                              //Verify if the array is already empty
        currentWord.innerHTML = "GAME OVER";                                                      //Display Game Over
        instructions.innerHTML = "No more houses";                                                //Display that there are no more houses left                               
        game.soundEnd.play();                                                                     //Play sound
        game.soundEnd.volume = 0.05;                                                              //Decrease volume
      }

      game.initialized = false;                                                                   //Remove flag
      wordsGuessed.innerHTML = game.gamesWon;                                                     //Update score display
      wordsMissed.innerHTML = game.gamesLost;
    }
  }
};