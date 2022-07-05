function Game(human, computer) {
  //INIT CANVAS
  const canvas = document.getElementById("cvs");
  const ctx = canvas.getContext("2d");
  //BOARD FIELD SETTINGS
  let board = [];
  const COLUMN = 3;
  const ROW = 3;
  const SPACE_SIZE = 150;
  //BOARD ARRAY THAT INDICATES PLAYER'S MOVES AND WHICH ONE IS FILLED
  let boardRectCoord = [];
  let id = 0;
  //
  const COMBOS = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let GAME_OVER = false;
  const xImage = new Image();
  xImage.src = "./xImage.png";
  const oImage = new Image();
  oImage.src = "./oImage.png";
  const gameOverElem = document.getElementById("gameover");

  let currentIDChoice = 0;
  let currentPlayer = human; //[human, computer][Math.floor(Math.random() * 2)]; // let currentPlayer = human;

  drawBoard();

  function drawBoard() {
    for (let i = 0; i < ROW; i++) {
      board[i] = [];
      for (let j = 0; j < COLUMN; j++) {
        board[i][j] = id;
        boardRectCoord[id] = {
          x: j * SPACE_SIZE,
          y: i * SPACE_SIZE,
          id: id,
          isActive: false,
          value: "",
        };
        ctx.strokeStyle = "#000";

        ctx.strokeRect(j * SPACE_SIZE, i * SPACE_SIZE, SPACE_SIZE, SPACE_SIZE);

        id++;
      }
      ctx.strokeStyle = "orangered";
      ctx.strokeRect(boardRectCoord[0]["x"], boardRectCoord[0]["y"], 150, 150);
      //boardRectCoord[0]["isActive"] = true;
      currentIDChoice = 0;
    }
  }
  if (currentPlayer == computer) {
    computerMove();
    window.addEventListener("keyup", PlayerChoice);
  } else {
    window.addEventListener("keyup", PlayerChoice);
  }

  function PlayerChoice(e) {
    if (GAME_OVER) {
      return;
    } else if (e.which == "37" /**arrow left */) {
      if (currentIDChoice == 0) {
        drawBlackStroke(currentIDChoice);
        currentIDChoice = boardRectCoord.length - 1;
        drawOrangeStroke(currentIDChoice);
      } else {
        drawBlackStroke(currentIDChoice);
        currentIDChoice--;
        drawOrangeStroke(currentIDChoice);
      }
    } else if (e.which == "39" /**arrow right */) {
      if (currentIDChoice == boardRectCoord.length - 1) {
        drawBlackStroke(currentIDChoice);
        currentIDChoice = 0;
        drawOrangeStroke(currentIDChoice);
      } else {
        drawBlackStroke(currentIDChoice);
        currentIDChoice++;
        drawOrangeStroke(currentIDChoice);
      }
    } else if (e.which == "38" /**arrow up */) {
      if (currentIDChoice - 3 < 0) {
        drawBlackStroke(currentIDChoice);
        //color new place
        currentIDChoice = boardRectCoord.length + (currentIDChoice - 3);
        drawOrangeStroke(currentIDChoice);
      } else {
        //erase old place
        drawBlackStroke(currentIDChoice);
        //color new place
        currentIDChoice -= 3;
        drawOrangeStroke(currentIDChoice);
      }
    } else if (e.which == "40" /**arrow down */) {
      if (currentIDChoice + 3 > boardRectCoord.length - 1) {
        //erase old place
        drawBlackStroke(currentIDChoice);
        //color new place
        currentIDChoice = currentIDChoice + 3 - boardRectCoord.length;
        drawOrangeStroke(currentIDChoice);
      } else {
        //erase old place
        drawBlackStroke(currentIDChoice);
        //color new place
        currentIDChoice = currentIDChoice + 3;
        drawOrangeStroke(currentIDChoice);
      }
    } else if (e.which == "13" /**IF PLAYER HIT ENTER */) {
      if (boardRectCoord[currentIDChoice].value === "") {
        boardRectCoord[currentIDChoice].value = currentPlayer;
        drowOnBoard(
          currentPlayer,
          boardRectCoord[currentIDChoice].y,
          boardRectCoord[currentIDChoice].x
        );
        if (isWinner(currentPlayer)) {
          showGameOver(currentPlayer);
          GAME_OVER = true;
          return;
        }
        if (isTie()) {
          showGameOver("tie");
          GAME_OVER = true;
          return;
        }
        currentPlayer = computer;
        computerMove();
        if (isWinner(currentPlayer)) {
          showGameOver(currentPlayer);
          GAME_OVER = true;
          return;
        }
        if (isTie()) {
          showGameOver("tie");
          GAME_OVER = true;
          return;
        }
      } else {
        drowOnBoard(
          boardRectCoord[currentIDChoice].value,
          boardRectCoord[currentIDChoice].y,
          boardRectCoord[currentIDChoice].x
        );
      }
    }
  }
  function computerMove() {
    let EMPTY_SPACES = boardRectCoord.filter((data) => data.value == "");
    let id = EMPTY_SPACES[Math.floor(Math.random() * EMPTY_SPACES.length)].id;
    boardRectCoord[id].value = currentPlayer;
    boardRectCoord[id].isActive = true;

    drowOnBoard(currentPlayer, boardRectCoord[id].y, boardRectCoord[id].x);

    if (isWinner(currentPlayer, boardRectCoord)) {
      showGameOver(currentPlayer);
      GAME_OVER = true;
      return;
    }
    if (isTie(boardRectCoord)) {
      showGameOver("tie");
      GAME_OVER = true;
      return;
    }
    currentPlayer = human;
  }
  /**DRAWING X OR O */
  function drowOnBoard(curPlayer, i, j) {
    const img = curPlayer == "X" ? xImage : oImage;
    //.log(img, SPACE_SIZE);
    ctx.drawImage(img, j, i, SPACE_SIZE, SPACE_SIZE);
  }
  /**CHECKIN THE WIN COMBINATION */
  function isWinner(player) {
    for (let i = 0; i < COMBOS.length; i++) {
      let won = true;
      for (let j = 0; j < COMBOS[i].length; j++) {
        let id = COMBOS[i][j];
        won = boardRectCoord[id].value == player && won; //if at least one index false=> all array[i] will be false
      }
      if (won) return true;
    }
    return false;
  }
  function isTie() {
    if (boardRectCoord.every((dict) => dict.value != "")) {
      //if all board if filled out
      return true;
    }
    return false;
  }
  function showGameOver(player) {
    let imgSrc = `./${player.toLowerCase()}Image.png`;
    let message = player == "tie" ? "No Winner" : "The Winner is";
    gameOverElem.style.textAlign = "center";
    gameOverElem.style.width = "450px";
    gameOverElem.style.height = "350px";
    gameOverElem.style.backgroundColor = "gray";
    gameOverElem.style.borderRadius = "25%";
    gameOverElem.innerHTML = `
  <h1 class="enter">${message}</h1>
  <img class="winner-img"  style="width:100px;height:100px;"src=${imgSrc}>
  <h2>PLAY AGAIN?</h2>
  <h3>Hit <a class="enter">ENTER</a> to <a class="enter"> RESTART</a></h3>
  <h3>Hit <a class="cancel">BACKSPACE</a> to <a class="cancel">CANCEL</a></h3>`;
    gameOverElem.classList.remove("hide");
    canvas.style.display = "none";
    window.addEventListener("keyup", restartGame);
  }
  function restartGame(e) {
    if (e.which == "13") {
      gameOverElem.classList.add("hide");
      window.location.reload();
    } else if (e.which == "8") {
      window.open("https://google.com");
    }
  }
  function drawBlackStroke(id) {
    ctx.strokeStyle = "#000";
    ctx.strokeRect(
      boardRectCoord[id]["x"],
      boardRectCoord[id]["y"],
      SPACE_SIZE,
      SPACE_SIZE
    );
    boardRectCoord[id]["isActive"] = false;
  }
  function drawOrangeStroke(id) {
    ctx.strokeStyle = "orangered";
    ctx.strokeRect(boardRectCoord[id]["x"], boardRectCoord[id]["y"], 150, 150);
    boardRectCoord[id]["isActive"] = true;
  }
}
