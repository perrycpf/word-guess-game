window.onload = function () {

    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
          'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
          't', 'u', 'v', 'w', 'x', 'y', 'z'];
    
    var getHint;             // Word getHint
    var mTitle;              // Random selected movie title
    var mTitleImage;         // Image for random selected movie title
    var mTitleMusic;         // Music for random selected movie title
    var mTitleHints;         // Hints for random selected movie title
    var correctCounter;      // Count correct geusses
    var guessedLetters;      // Stored guessing letters
    var correctLetters;      // Stored corrected letters
    var letters;             // Stored virtual keyboard letters
    // Object for storing the movie titles, images, songs and hints
    var movies = { names  : ["die-hard", "alien", "kill-bill", "godzilla","jaws","matrix", "star-wars", "indiana-jones", "mission-impossible", "kingsman"],
                   images : ["assets/images/die-hard.jpg","assets/images/alien.jpg", "assets/images/kill-bill.jpg","assets/images/godzilla.jpg","assets/images/jaws.jpg", 
                             "assets/images/matrix.jpg","assets/images/star-wars.jpg","assets/images/indiana-jones.jpg","assets/images/mission-impossible.jpg",
                             "assets/images/kingsman.jpg"],
                   musics : ["assets/sounds/die-hard.mp3", "assets/sounds/alien.mp3","assets/sounds/kill-bill.mp3","assets/sounds/godzilla.mp3","assets/sounds/jaws.mp3",
                             "assets/sounds/matrix.mp3","assets/sounds/star-wars.mp3","assets/sounds/indiana-jones.mp3","assets/sounds/mission-impossible.mp3",
                            "assets/sounds/kingsman.mp3"],
                   hints  : ["Officer of the NYPD","Horror science fiction", "American martial arts", "Dinosaur from Japan", "Big fish", "Simulated reality", "Space related science fiction",
                             "Professor of archaeology", "Spy film", "Probationary secret agent"],
                   gameFinished : false, // Game finished flag
                   musicPlaying : false, // Music playing flag 
                   liveCounter  : 10     // # of lives for playing each game
                  } 
    var winCounter = 0;      // Summary score - win
    var lossCounter = 0;     // Summary score - loss
    var spaceCounter;        // Count spaces in movie titles
    var audioElement;        // Movie sounds object
    var generalImage = "assets/images/guessing1.gif" // General image
  
    // Get elements
    var showWinCounter = $("#winCounter");
    var showLossCounter = $("#lossCounter");
    var showLives = $("#mylives");
    var getHint = $("#hint");
    var showClue = $("#clue");

    // Create alphabet ul - virtual keyboard
    function keyBoard () {
      var myButtons = document.getElementById('buttons');

      letters = document.createElement('ul');
      letters.setAttribute('id', 'alphabet');
      $.each(alphabet, function (i, alphabetValue) {
        var list = document.createElement('li');

        $(list).attr('class', 'letter');
        $(list).attr('id', alphabetValue);
        $(list).html(alphabetValue);
        checkLetters(list);
        myButtons.appendChild(letters);
        letters.appendChild(list);
      });
    }

    // Create guessing word ul holder
    function guessResult () {
      var guessDiv = $('#guessHolder');
      
      correctLetters = document.createElement('ul');
      correctLetters.setAttribute ("id", "yourWord");
      for (i=0; i < mTitle.length; i++) {
        var guessedLetter = document.createElement('li');

        guessedLetter.setAttribute('class', 'guessedLetter');
        if (mTitle[i] === '-') {
          $(guessedLetter).html('-');
          spaceCounter +=1;
        } else {
          $(guessedLetter).html('_');
        }
        guessedLetters.push(guessedLetter);
        guessDiv.append(correctLetters);
        correctLetters.append(guessedLetter);     
      }
    }


    // Checking letters
    function checkLetters (list) {
      $(list).on('click', function() {
          if (movies.gameFinished == false) {
              var guessedLetter = (this.innerHTML);
              $(this).addClass('disabled');
              $(this).off('click');
              for (i=0; i < mTitle.length; i++) {
                if (mTitle[i] === guessedLetter) {
                  $(guessedLetters[i]).html (guessedLetter);
                  correctCounter +=1;
                }
              }
              if (mTitle.indexOf(guessedLetter) === -1) {
                movies.liveCounter -=1;
              }
              printLives();
          }    
      });
    }

    // Print remaining lives and game result
    function printLives () {
      if (movies.liveCounter < 1) {
        $(showLives).html("Game Over!😫");
        lossCounter +=1;
        movies.gameFinished = true;
        $('#lossCounter').html('Loss : ' + lossCounter);
      } else if ((correctCounter + spaceCounter) === guessedLetters.length) {
        $(showLives).html("You Win!👍");
        winCounter +=1;
        movies.gameFinished = true;
        $('#winCounter').html('Win : ' + winCounter);
        showImage_playMusic ();
      } else {
        $(showLives).html("You have " + movies.liveCounter + " lives remaining");
      }
    }

    // Show movie picture and play music for random selected movie name
    function showImage_playMusic () {
        $('#imageId').fadeTo(1200, 0.5, function() {
            $(this).addClass('w3-animate-opacity');
            $(this).attr('src', mTitleImage);
        }).delay(800).fadeTo('slow', 1, 'linear');
        // play music
        audioElement = document.createElement("audio");
        audioElement.setAttribute("src", mTitleMusic);
        audioElement.play();
        movies.musicPlaying = true;
    }

    // Play game
    function playGame () { 
      var randomIndex = Math.floor(Math.random() * movies.names.length);
      mTitle = movies.names[randomIndex];
      mTitleImage = movies.images[randomIndex];
      mTitleMusic = movies.musics[randomIndex];
      mTitleHints = movies.hints[randomIndex];
      
      console.log(randomIndex);
      console.log(mTitle);
      console.log(mTitleImage);
      console.log(mTitleMusic);
      console.log(mTitleHints);
      keyBoard();
      guessedLetters = [];
      movies.liveCounter = 10;
      correctCounter = spaceCounter = 0;
      movies.gameFinished = movies.musicPlaying = false;
      guessResult();
      printLives();
    }

    playGame();

    // Letter (case insensitive) input from computer keyboard
    document.onkeyup = function(event) {
      var keyPressed = event.key;
      keyPressed = keyPressed.toLowerCase();
      if (alphabet.indexOf(keyPressed) > -1 && movies.gameFinished == false) {
        keyPressed = '#' + keyPressed;
        $(keyPressed).trigger('click');
      }
    }

    // Reset for playing again
    $('#reset').on('click', function() {
      correctLetters.parentNode.removeChild(correctLetters);
      letters.parentNode.removeChild(letters);
      $(showClue).html("");
      $('#imageId').attr('src', generalImage);
      if (movies.musicPlaying) {
        audioElement.pause();
      }  
      playGame();
    });

    // Clue
    $('#hint').on('click', function() {
      $(showClue).html("Hint : " + mTitleHints);
    });
};   


