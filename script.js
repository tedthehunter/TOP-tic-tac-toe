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

        for (let i = 0; i < possibleWinPositions.length; i++) {
            if (checkThree(mark, possibleWinPositions[i])) {
                return true;
            }
        }

        return false;
    }

    return {getBoardState, changeBoardState, checkWin};
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
            gameBoard.checkWin('X');
        } else {
            gameBoard.changeBoardState('O', coords);
            gameBoard.checkWin('O');
        }

        togglePlayerTurn();
        return JSON.stringify(gameBoard.getBoardState());
    };

    return {togglePlayerTurn, getPlayerXTurn, playRound};
})();

console.log(flowController.playRound([0,0]));
console.log(flowController.playRound([0,2]));
console.log(flowController.playRound([1,0]));
console.log(flowController.playRound([1,2]));
console.log(flowController.playRound([2,0]));
console.log(gameBoard.checkWin(''));