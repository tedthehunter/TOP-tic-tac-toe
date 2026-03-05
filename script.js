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
                return `${mark} Player wins!`;
            }
        }

        if (checkTie(possibleWinPositions)) {
            return 'TIE';
        }

        return ;
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
    const xPlayer = createPlayer('Jim', 'X');
    const oPlayer = createPlayer('Bob', 'O');

    let isPlayerXTurn = true;

    function togglePlayerTurn() {
        isPlayerXTurn = !isPlayerXTurn;
    };

    function getPlayerXTurn() {
        return isPlayerXTurn;
    };

    function playRound(coords) {
        if (isPlayerXTurn) {
            gameBoard.changeBoardState('X', coords);
            console.log(gameBoard.checkWin('X'));
        } else {
            gameBoard.changeBoardState('O', coords);
            console.log(gameBoard.checkWin('O'));
        }

        togglePlayerTurn();

        displayController.updateBoard();
    };

    return {togglePlayerTurn, getPlayerXTurn, playRound};
})();

const displayController = (() => {
    const boardDOMElements = [
        [document.querySelector('#cell-0-0'), document.querySelector('#cell-0-1'), document.querySelector('#cell-0-2')],
        [document.querySelector('#cell-1-0'), document.querySelector('#cell-1-1'), document.querySelector('#cell-1-2')],
        [document.querySelector('#cell-2-0'), document.querySelector('#cell-2-1'), document.querySelector('#cell-2-2')]
    ];
    
    //adds an eventlistener to each square of the gameboard - CALL ONCE AT SETUP
    function initializeListeners() {
        for (let i = 0; i < boardDOMElements.length; i++) {
            for (let j = 0; j < boardDOMElements[i].length; j++) {
                // callback function calls playRound on the element of the 2D 'board' array that matches the clicked square's 2D index
                boardDOMElements[i][j].addEventListener('click', (event) => {
                    const parsedIDAsIndex = event.target.id.split('-');
                    console.log(parsedIDAsIndex);
                    flowController.playRound([parsedIDAsIndex[1], parsedIDAsIndex[2]]);
                });
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

    return {updateBoard, initializeListeners};
})();

displayController.initializeListeners();
displayController.updateBoard();