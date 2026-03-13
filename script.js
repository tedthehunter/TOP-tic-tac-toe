const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function getBoardState() {
        return board;
    }

    function changeBoardState(mark, coords) {
        board[coords[0]][coords[1]] = mark;
    }

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

    function reset() {
        board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]; 
    }

    return {getBoardState, changeBoardState, checkWin, reset};
})();

const createPlayer = (name, mark) => {
    function getMark() {
        return mark;
    };

    function getName() {
        return name;
    };

    return {getMark, getName};
};

const flowController = (() => {
    let isPlayerXTurn = true;
    let xPlayer;
    let oPlayer;

    function initializePlayers() {
        xPlayer = createPlayer(document.querySelector('#playerXName').value, 'X');
        oPlayer = createPlayer(document.querySelector('#playerOName').value, 'O');
    }

    function initializeStartButton() {
        document.querySelector('#game-start').addEventListener('click', (event) => {
            // start the game
            if (event.target.innerHTML === 'Start Game') {
                displayController.initializeListeners();
                event.target.innerHTML = 'Reset';
                initializePlayers();
            }
            // reset the game - set player X to first turn, clear the board, remove eventlisteners
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

const displayController = (() => {
    const boardDOMElements = [
        [document.querySelector('#cell-0-0'), document.querySelector('#cell-0-1'), document.querySelector('#cell-0-2')],
        [document.querySelector('#cell-1-0'), document.querySelector('#cell-1-1'), document.querySelector('#cell-1-2')],
        [document.querySelector('#cell-2-0'), document.querySelector('#cell-2-1'), document.querySelector('#cell-2-2')]
    ];
    
    function playOnSquare(event) {
        const parsedIDAsIndex = event.target.id.split('-');
        flowController.playRound([parsedIDAsIndex[1], parsedIDAsIndex[2]]);
    }

    //adds an eventlistener to each square of the gameboard - CALL ONCE AT SETUP
    function initializeListeners() {
        for (let i = 0; i < boardDOMElements.length; i++) {
            for (let j = 0; j < boardDOMElements[i].length; j++) {
                // callback function calls playRound on the element of the 2D 'board' array that matches the clicked square's 2D index
                boardDOMElements[i][j].addEventListener('click', playOnSquare, {once: true});
            }
        }
    }

    //clicks each eventlistener to remove them, useful for resetting board state
    function removeListeners() {
        for (let i = 0; i < boardDOMElements.length; i++) {
            for (let j = 0; j < boardDOMElements[i].length; j++) {
                // callback function calls playRound on the element of the 2D 'board' array that matches the clicked square's 2D index
                boardDOMElements[i][j].removeEventListener('click', playOnSquare);
            }
        }
    }

    //updates the content of each board square to match the 2D 'board' array
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

flowController.initializeStartButton();