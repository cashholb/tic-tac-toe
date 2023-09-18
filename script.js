
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

        if(board[position].getValue() == 0)
        {
            board[position].setValue(playerToken);
            return true;
        }else{
            return false;
        }
    };

    // create a printBoard
    const printBoard = () => {
        console.log(`${board[0].getValue()} | ${board[1].getValue()} | ${board[2].getValue()}`);
        console.log(`${board[3].getValue()} | ${board[4].getValue()} | ${board[5].getValue()}`);
        console.log(`${board[6].getValue()} | ${board[7].getValue()} | ${board[8].getValue()}`);
    };

    // return public getter, fillSpace, and printBoard
    return {getBoard, getSpaces, makeMove, printBoard};
}

function Cell() {

    // value
    let value = 0;

    // getter 
    const getValue = () => value;

    // setter
    const setValue = (newValue) => value = newValue;

    // return public getter and setter
    return {getValue, setValue};
}

function GameController() {

    const board = Gameboard();

    const players = [
        {
            name: "Player One",
            token: 1,
        },
        {
            name: "Player Two",
            token: 2,
        },
    ];
    let activePlayer = players[0];


    const getActivePlayer = () => activePlayer;

    const _switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const _printNewRound = () => {
        board.printBoard();
        console.log(`It is ${getActivePlayer().name}'s turn`);
    };

    const _checkWin = () => {
        const tokenToCheck = getActivePlayer().token;
        const currBoard = board.getBoard();

        // check vertical
        console.log(tokenToCheck);
        console.log(currBoard[0]);
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

    const _printWin =  () => {
        console.log("Game Over");
        console.log(`${activePlayer.name} won!`);
    }

    const playTurn = (move) => {
        // make move
        if(!board.makeMove(move, activePlayer.token)) {
            // can't make move here
            console.log("space already taken, make another choice");
        }else{

            if(_checkWin())
            {
                board.printBoard();
                _printWin();
                return;
            }
            _switchPlayerTurn();
        }

        _printNewRound();
    };

    _printNewRound();

    return {playTurn, getActivePlayer, getBoard: board.getBoard, getSpaces: board.getSpaces};
}



(function ScreenController() {

    const game = GameController();

    const playerTurnDiv = document.querySelector(".player-turn");
    const gameboardDiv = document.querySelector(".gameboard");

    const updateScreen = () => {

        // clear the board
        gameboardDiv.innerHTML = "";

        const board = game.getBoard();
        const currPlayer = game.getActivePlayer();

        // display current player's turn
        playerTurnDiv.textContent = currPlayer.name;

        // populate game board
        for(let i = 0; i < game.getSpaces(); i++)
        {
            const cell = document.createElement('button');
            cell.classList.add('.cell');
            cell.textContent = board[i].getValue();
            cell.onclick = clickEventHandler;
            gameboardDiv.appendChild(cell);
        }
    }

    const clickEventHandler = (e) => {
        const clickedCell = e.target;
        const cellIndex = Array.from(gameboardDiv.children).indexOf(clickedCell);

        game.playTurn(cellIndex);
        updateScreen();
    }

    updateScreen();

})();


