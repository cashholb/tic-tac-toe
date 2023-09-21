
function Gameboard() {

    const spaces = 9
    const board = [];

    // fill in board here (fill with cells)
    for(let i = 0; i < spaces; i++){
        board[i] = Cell();
    }

    const getSpaces = () => spaces;

    // create getter for Gameboard
    const getBoard = () => board;

    // create fill space for Gameboard
    const makeMove = (position, playerToken) => {

        if(board[position].getValue() == "")
        {
            board[position].setValue(playerToken);
            return true;
        }else{
            return false;
        }
    };

    const clearBoard = () => {
        for(let i = 0; i < spaces; i++){
            board[i] = Cell();
        }
    }

    // create a printBoard
    const printBoard = () => {
        console.log(`${board[0].getValue()} | ${board[1].getValue()} | ${board[2].getValue()}`);
        console.log(`${board[3].getValue()} | ${board[4].getValue()} | ${board[5].getValue()}`);
        console.log(`${board[6].getValue()} | ${board[7].getValue()} | ${board[8].getValue()}`);
    };

    // return public getter, fillSpace, and printBoard
    return {getBoard, clearBoard, getSpaces, makeMove, printBoard};
}

function Cell() {

    // value
    let value = "";

    // getter 
    const getValue = () => value;

    // setter
    const setValue = (newValue) => value = newValue;

    const clearValue = () => setValue("");

    // return public getter and setter
    return {getValue, setValue, clearValue};
}



function GameController() {

    const board = Gameboard();

    let gameType = "PVP";

    const players = [
        {
            name: "Player 1",
            token: "X",
        },
        {
            name: "Player 2",
            token: "O",
        },
    ];
    let activePlayer = players[0];

    const getPlayers = () => players;

    const setGameType = (gt) => gameType = gt;

    const getGameType = () => gameType;

    const _setActivePlayer = (playerNumber) => {
        activePlayer = players[playerNumber];
    }

    const getActivePlayer = () => activePlayer;

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const _printNewRound = () => {
        board.printBoard();
        console.log(`It is ${getActivePlayer().name}'s turn`);
    };

    const checkWin = (player) => {
        const tokenToCheck = player.token;
        const currBoard = board.getBoard();

        // check vertical
        if(currBoard[0].getValue() == tokenToCheck && currBoard[1].getValue() == tokenToCheck && currBoard[2].getValue() == tokenToCheck){
            return true;
        }
        if(currBoard[3].getValue() == tokenToCheck && currBoard[4].getValue() == tokenToCheck && currBoard[5].getValue() == tokenToCheck){
            return true;
        }
        if(currBoard[6].getValue() == tokenToCheck && currBoard[7].getValue() == tokenToCheck && currBoard[8].getValue() == tokenToCheck){
            return true;
        }

        // check horizontal
        if(currBoard[0].getValue() == tokenToCheck && currBoard[3].getValue() == tokenToCheck && currBoard[6].getValue() == tokenToCheck){
            return true;
        }
        if(currBoard[1].getValue() == tokenToCheck && currBoard[4].getValue() == tokenToCheck && currBoard[7].getValue() == tokenToCheck){
            return true;
        }
        if(currBoard[2].getValue() == tokenToCheck && currBoard[5].getValue() == tokenToCheck && currBoard[8].getValue() == tokenToCheck){
            return true;
        }

        // check diagonal
        if(currBoard[0].getValue() == tokenToCheck && currBoard[4].getValue() == tokenToCheck && currBoard[8].getValue() == tokenToCheck){
            return true;
        }
        if(currBoard[2].getValue() == tokenToCheck && currBoard[4].getValue() == tokenToCheck && currBoard[6].getValue() == tokenToCheck){
            return true;
        }

        return false;
    };

    const checkTie = () => {
        const currBoard = board.getBoard();

        for(let i = 0; i < currBoard.length; i++) {
            if(currBoard[i].getValue() == "")
            {
                return false;
            }
        }

        return true;
    }

    const _printWin =  () => {
        console.log("Game Over");
        console.log(`${activePlayer.name} won!`);
    }

    const _printTie = () => {
        console.log("Game Over");
        console.log("It's a draw");
    }

    const startGame = (gameType) => {

        _setActivePlayer(Math.floor(Math.random() * players.length));

        if(gameType == "PVP") {
            players[1].name = "Player 2";
        }else if(gameType == "PVE_EASY" || gameType == "PVE_IMPOSSIBLE"){
            players[1].name = "Computer";
            if(getActivePlayer() == players[1])
                easyCompMove();
        }
    }

    // takes a random possible move
    const easyCompMove = () => {

        // easy computer turn logic (random choice)
        let choicesArray = [];
        for(let i = 0; i < board.getBoard().length; i++)
        {
            if(board.getBoard()[i].getValue() == "")
            {
                choicesArray.push(i);
            }
        }
        
        const compMove = choicesArray[Math.floor(Math.random() * (choicesArray.length - 1))];
        playTurn(compMove);
    }

    const adversaryMove = () => {

        let currBoard = board.getBoard();
        let bestScore = -Infinity;
        let bestMove;

        for(let i = 0; i < currBoard.length; i++) {
            if(currBoard[i].getValue() == ""){

                // first children of the tree
                currBoard[i].setValue(players[1].token);
                let score = _miniMax(currBoard, 0, false);
                let bruh = currBoard.map((cell) => cell.getValue());
                console.log(bruh);
                
                currBoard[i].clearValue();
                if(score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        playTurn(bestMove);
    }

    const _miniMax = (currBoard, isMaximizing) => {

        // check for winner
        // check for terminal state and associated score
        // to be refactored if there's more than 2 players

        if(checkWin(players[0])){
            return -1
        }
        if(checkWin(players[1])){
            return 1;
        }
        if(checkTie()){
            return 0;
        }

        // for maximizing player
        if (isMaximizing) {
            let bestScore = -Infinity;
            // check all possible spots
            for (let i = 0; i < currBoard.length; i++){
                if(currBoard[i].getValue() == "")
                {
                    currBoard[i].setValue(players[1].token);
                    let score =_miniMax(currBoard, false);
                    currBoard[i].clearValue();
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        }else{
            // for minimizing player
            let bestScore = Infinity;
            // check all possible spots
            for (let i = 0; i < currBoard.length; i++){
                if(currBoard[i].getValue() == "")
                {
                    currBoard[i].setValue(players[0].token);
                    let score = _miniMax(currBoard, true);
                    currBoard[i].clearValue();
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    const playTurn = (move) => {
        // make move
        if(!board.makeMove(move, activePlayer.token)) {
            // can't make move here
            console.log("space already taken, make another choice");
        }else{

            if(checkWin(activePlayer))
            {
                //board.printBoard();
                //_printWin();
                return;
            }else if(checkTie()){
                //_printTie();
                return;
            }
            _switchPlayerTurn();
        }

        if(gameType == "PVE_EASY" && activePlayer == players[1]){
            easyCompMove();
        }
        if(gameType == "PVE_IMPOSSIBLE" && activePlayer == players[1]){
            adversaryMove();
        }
    };

    return {getGameType, setGameType, startGame, playTurn, getPlayers, getActivePlayer, checkWin, checkTie, getBoard: board.getBoard, getSpaces: board.getSpaces, clearBoard: board.clearBoard};
}





(function ScreenController() {

    const game = GameController();

    const playerTurnDiv = document.querySelector(".player-turn");
    const playerOneDiv = document.querySelector('.p-one');
    const playerTwoDiv = document.querySelector('.p-two');
    const gameboardDiv = document.querySelector(".gameboard");
    const restartDiv = document.querySelector(".restart-btn");
    const modalDiv = document.querySelector(".menu-modal");
    const winDiv = document.querySelector(".win-message");

    restartDiv.addEventListener("click", () => {
        game.clearBoard();
        updateScreen();
        winDiv.textContent = "";
        modalDiv.showModal();
    });

    const pvpDiv = document.querySelector(".pvp");
    pvpDiv.addEventListener("click", () => {
        game.setGameType("PVP");
        game.startGame(game.getGameType());
        updateScreen();
        modalDiv.close();
    })

    const pveEasyDiv = document.querySelector(".pve-easy");
    pveEasyDiv.addEventListener("click", () => {
        game.setGameType("PVE_EASY");
        game.startGame(game.getGameType());
        updateScreen();
        modalDiv.close();
    })

    const pveImpossibleDiv = document.querySelector(".pve-impossible");
    pveImpossibleDiv.addEventListener("click", () => {
        game.setGameType("PVE_IMPOSSIBLE");
        game.startGame(game.getGameType());
        updateScreen();
        modalDiv.close();
    })

    const updateScreen = () => {


        // clear the board
        gameboardDiv.innerHTML = "";

        const board = game.getBoard();
        const currPlayer = game.getActivePlayer();

        // display player names
        playerOneDiv.querySelector(".name").textContent = game.getPlayers()[0].name;
        playerTwoDiv.querySelector(".name").textContent = game.getPlayers()[1].name;

        // display current player's turn
        

        // populate game board
        for(let i = 0; i < game.getSpaces(); i++)
        {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.textContent = board[i].getValue();
            cell.onclick = moveEventHandler;

            if(board[i].getValue() == "X")
            {
                cell.style.color = "#fe5f55";
            }else if(board[i].getValue() == "O"){
                cell.style.color = "#94c9a9";
            }

            gameboardDiv.appendChild(cell);
        }
    }

    const moveEventHandler = (e) => {
        const clickedCell = e.target;
        const cellIndex = Array.from(gameboardDiv.children).indexOf(clickedCell);

        game.playTurn(cellIndex);
        updateScreen();

        // check win
        if(game.checkWin(game.getActivePlayer())) {
            winDiv.textContent = `${game.getActivePlayer().name} wins!`;

            // remove ability to place new move
            Array.from(gameboardDiv.children).map((cell) => cell.onclick = "");
        }else if (game.checkTie()){
            winDiv.textContent = `It's a draw!`;
            Array.from(gameboardDiv.children).map((cell) => cell.onclick = "");
        }
    }

    modalDiv.showModal();
    updateScreen();
})();
