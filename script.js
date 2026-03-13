const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function getBoardState() {
        return board;
    }

    //Places 'mark' at the coordinates submitted in a two-item, 1D array, i.e. [0, 1] or [1, 2]
    function changeBoardState(mark, coords) {
        board[coords[0]][coords[1]] = mark;
    }

    //Checks all possible win states for 'mark', returning true, 'TIE', or false
    function checkWin(mark) {
        const possibleWinPositions = [
            board[0],
            board[1],
            board[2],
            [board[0][0], board[1][0], board[2][0]],
            [board[0][1], board[1][1], board[2][1]],
            [board[0][2], board[1][2], board[2][2]],
            [board[0][0], board[1][1], board[2][2]],
            [board[2][0], board[1][1], board[0][2]]
        ];

        function checkThree(mark, array) {
            return array.every(element => element === mark);
        }

        function checkTie(possibleWinPositions) {
            return possibleWinPositions.every(subArray => (subArray.includes('X') && subArray.includes('O')));
        }

        for (let i = 0; i < possibleWinPositions.length; i++) {
            if (checkThree(mark, possibleWinPositions[i])) {
                displayController.removeListeners();
                return true
            }
        }

        if (checkTie(possibleWinPositions)) {
            displayController.removeListeners();
            return 'TIE';
        }

        return false;
    }

    //Clears the board in data, does not update DOM, see displayController.updateBoard()
    function reset() {
        board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]; 
    }

    //Board not globally accessible, can only be changed via gameBoard methods
    return {getBoardState, changeBoardState, checkWin, reset};
})();

//Player objects include an input for mark to open the possibility of letting players choose their own letter
const createPlayer = (name, mark) => {
    function getMark() {
        return mark;
    };

    function getName() {
        return name;
    };

    return {getMark, getName};
};

//Primary game logic
const flowController = (() => {
    let isPlayerXTurn = true; //Player X goes first
    let xPlayer;
    let oPlayer;

    //Takes input of player names from DOM and creates matching Player objects
    function initializePlayers() {
        xPlayer = createPlayer(document.querySelector('#playerXName').value, 'X');
        oPlayer = createPlayer(document.querySelector('#playerOName').value, 'O');
    }

    //Adds an eventlistener to the button that allows the game to be played
    function initializeStartButton() {
        document.querySelector('#game-start').addEventListener('click', (event) => {
            //Start the game
            if (event.target.innerHTML === 'Start Game') {
                displayController.initializeListeners(); //Each square is a clickable board space
                event.target.innerHTML = 'Reset'; //Button toggles to a reset button during play
                initializePlayers();
            }
            //Reset the game - set player X to first turn, clear the board, remove eventlisteners
            else {
                if (!isPlayerXTurn) {
                    togglePlayerTurn();
                }
                displayController.removeListeners();
                gameBoard.reset();
                displayController.updateBoard();
                event.target.innerHTML = 'Start Game';
                document.querySelector('#game-status').innerHTML = '';
            }
        });
    }

    function togglePlayerTurn() {
        isPlayerXTurn = !isPlayerXTurn;
    };

    //Takes player, and coordinates from clicked board space to add appropriate mark, then checks the win state
    function playTurn(player, coords) {
        gameBoard.changeBoardState(player.getMark(), coords);
            switch (gameBoard.checkWin(player.getMark())) {
                case true:
                    document.querySelector('#game-status').innerHTML = `${player.getName()} wins!`;
                    break;
                case 'TIE':
                    document.querySelector('#game-status').innerHTML = 'Tie game!';
                    break;
            };
    }

    //Turn handler, plays for player with active turn on input coords from displayController
    function playRound(coords) {
        if (isPlayerXTurn) {
            playTurn(xPlayer, coords);
        } else {
            playTurn(oPlayer, coords);
        };

        togglePlayerTurn();

        displayController.updateBoard();
    };

    return {initializeStartButton, playRound, initializePlayers};
})();

//Manages DOM display, adds eventlisteners to board squares
const displayController = (() => {
    //Each square element has an easily parseable id value
    const boardDOMElements = [
        [document.querySelector('#cell-0-0'), document.querySelector('#cell-0-1'), document.querySelector('#cell-0-2')],
        [document.querySelector('#cell-1-0'), document.querySelector('#cell-1-1'), document.querySelector('#cell-1-2')],
        [document.querySelector('#cell-2-0'), document.querySelector('#cell-2-1'), document.querySelector('#cell-2-2')]
    ];
    
    //Custom event function that parses id of clicked board square
    function playOnSquare(event) {
        const parsedIDAsIndex = event.target.id.split('-');
        flowController.playRound([parsedIDAsIndex[1], parsedIDAsIndex[2]]);
    }

    //Adds an eventlistener to each square of the gameboard, calls playOnSquare
    function initializeListeners() {
        for (let i = 0; i < boardDOMElements.length; i++) {
            for (let j = 0; j < boardDOMElements[i].length; j++) {
                //Evenlisteners are self destructive, can't overwrite a previously clicked square
                boardDOMElements[i][j].addEventListener('click', playOnSquare, {once: true}); 
            }
        }
    }

    //Removes eventlisteners, freezing board state at game end
    function removeListeners() {
        for (let i = 0; i < boardDOMElements.length; i++) {
            for (let j = 0; j < boardDOMElements[i].length; j++) {
                boardDOMElements[i][j].removeEventListener('click', playOnSquare);
            }
        }
    }

    //Updates the content of each board square to match the 2D 'board' array in gameBoard.board
    function updateBoard() {
        const boardData = gameBoard.getBoardState();

        for (let i = 0; i < boardData.length; i++) {
            for (let j = 0; j < boardData[i].length; j++) {
                boardDOMElements[i][j].innerHTML = boardData[i][j];
            }
        }
    }

    return {updateBoard, initializeListeners, removeListeners};
})();

//Necessary global declaration to kick off start button functionality
flowController.initializeStartButton();