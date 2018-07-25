$(function() {
	// ======================== MODEL ======================== //
	const model = {
		// track guess count & games won/lost.
		guessCount: 0,
		winCount: 0,
		lossCount: 0,
		// word list.
		guessWords: [
			"germany","zebra","and","bunny","to","apple","is","you","that","it","he",
			 "was","for","on","are","as","with","shark","they","at","be",
			 "this","have","from","cookies","one","had","by","word","but","not",
			 "what","all","were","we","when","your","can","said","there",
			 "wabbajack","happy","each","which","she","do","jedi","their","if","will",
			 "bubble","other","about","out","many","then","them","these","so",
			 "some","monster","would","make","like","him","into","time","has",
			 "look","two","more","write","go","see","number","no","way",
			 "could","people","my","than","first","water","iceman","call",
			 "who","oil","its","now","find","long","down","day","did","get",
			 "come","made","may","part"
		],
	};
	// ======================== CONTROLLER ======================== //
	const controller = {
		// initializes the view.
		init: () => {
			view.init()
		},

		// return array of guess words.
		getWordList: () => model.guessWords,

		// return randomly selected guess word.
		getRandomWord: () => {
			for (let i = 0; i < model.guessWords.length; i++) {
				var randomWord = Math.floor(Math.random() * model.guessWords.length);
				return model.guessWords[randomWord];
			}
		},

		// return current guess count.
		getGuessCount: () => model.guessCount,
		// updates guess count on letter click.
		updateGuessCount: () => model.guessCount++,
		// resets guess count to zero.
		resetGuessCount: () => {
			model.guessCount = 0;
		},

		// return current win count.
		getCurrentWinCount: () => model.winCount,
		// update winCount on game win.
		updateGameWins: () => {
			model.winCount++;
		},

		// return current wins.
		getCurrentLossCount: () => model.lossCount,
		// update winCount on game win.
		updateGameLosses: () => {
			model.lossCount++;
		},
	};
	// ======================== VIEW ======================== //
	const view = {
		// initial setup for view.
		init: function() {
			// setup variables.
  		let currentWordFull;
  		const currentWord = controller.getRandomWord();

			// calls render function.
			this.render();
		},

		// content rendered to DOM.
		render: function() {

			resetGame = () => {
				// clear past game data.
	   		$("#alphabet-keypad > .letter-disabled").each(function(index, element){
	  			$(element).removeClass().addClass('letter-button');
				});
		    $('#letter-graveyard > div').each(function(index, element){
		      $(element).remove();
		    });
		    $('#word-to-guess').each(function(index, element){
		      $(element).children().html('');
		    });
		    $("#word-to-guess").html('');

		    // reset guess count & hangman image.
		    document.getElementById("hangmanGuy").src="http://localhost:3000/img/hangman-graphic/hangman-img0.png";
		    controller.resetGuessCount();

		    // generate new guess word.
		    setWordToBeGuessed();
			}

			// updates game win count/resets ui for next round.
		  gameWon = () => {
		    const correctlyGuessedLettersCount = $(".is-letter > span").length;
		    if (correctlyGuessedLettersCount === currentWord.length) {
		    	alert("YOU WON!!");

		    	controller.updateGameWins();
		    	document.getElementById("winCount").innerHTML = controller.getCurrentWinCount();

		    	resetGame();
		    }
		  }

		  // updates game loss count/resets ui for next round.
		  gameLost = () => {
		    const maxCount = controller.getGuessCount();
		    if (maxCount == 7) {
		    	alert("YOU LOST...");

		    	controller.updateGameLosses();
		    	document.getElementById("lossCount").innerHTML = controller.getCurrentLossCount();

		    	resetGame();
		    }
		  }

		  // change hangan animation as wrong guess increments.
		  changeHangmanAnimation = () => {
		  	wrongGuess = controller.getGuessCount();
				const hangmanImg = document.getElementById("hangmanGuy");
				if (wrongGuess == 0) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img0.png";
				} else if (wrongGuess == 1) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img1.png";
				} else if (wrongGuess == 2) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img2.png";
				} else if (wrongGuess == 3) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img3.png";
				} else if (wrongGuess == 4) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img4.png";
				} else if (wrongGuess == 5) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img5.png";
				} else if (wrongGuess == 6) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img6.png";
				} else if (wrongGuess == 7) {
					hangmanImg.src="http://localhost:3000/img/hangman-graphic/hangman-img7.png";
				}
		  }

			// creates click handler for keyboard letters.
			$("#alphabet-keypad").on("click", ".letter-button", function() {
		    let letterPicked = $(this);
		    // apply css to ltters once clicked.
		    letterPicked
		      .removeClass("letter-button")
		      .addClass("letter-disabled");
		    // stores letters html.
		    letterPicked = letterPicked.html();
		    handlePickedLetter(letterPicked);

		    gameLost();
			});

		  handlePickedLetter = letterPicked => {
		    const resultMatches = [];
		    let index = currentWord.indexOf(letterPicked);

		    // if letterPicked matches one or more letters in the current word
		    // push all instances of that letter to resultMatches
		    while (index !== -1) {
		      resultMatches.push(index);
		      index = currentWord.indexOf(letterPicked, index + 1);
		    }

		    //if resultMatches is greater than 0 proceed to place them in the dom
		    if (resultMatches.length > 0) {
		      const letterBlocks = document.getElementsByClassName("is-letter");
		      resultMatches.map(function(num) {
		      	// create html element/store letter inside.
		        const domElem = document.createElement("span");
		        domElem.innerHTML = currentWordFull[num].toUpperCase();
		        letterBlocks[num].appendChild(domElem);

		        gameWon();
		      });
		    } else if (resultMatches.length == 0) {
		    	controller.updateGuessCount();
		    	changeHangmanAnimation();
		    }
		  }

		 // displays guess word to DOM
		 setWordToBeGuessed = () => {
		    currentWordFull = controller.getRandomWord();
		    //set an all upper case version of the current word
		    currentWord = currentWordFull.toUpperCase();
		    //creates blocks in the DOM indicating where there are letters and spaces
		    currentWord.split("").map(function(character) {
		      var guessWordBlock = document.getElementById("word-to-guess");
		      var domElem = document.createElement("div");
		      if (character.match(/[a-z]/i)) {
		        domElem.className = "character-block is-letter guessWord";
		      } else {
		        domElem.className = "character-block";
		      }
		      guessWordBlock.appendChild(domElem);
		    });
		  };
		  setWordToBeGuessed();
		} // end render
	};
	// initializes the controller.
	controller.init();
});