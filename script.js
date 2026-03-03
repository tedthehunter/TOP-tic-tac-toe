const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    function getBoardState() {
        return board;
    };

    function changeBoardState(mark, coords) {
        board[coords[0]][coords[1]] = mark;
    };

    function checkWin(mark) {
        return ;
    };

    return {getBoardState, changeBoardState};
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
        isPlayerXTurn ? gameBoard.changeBoardState('X', coords) : gameBoard.changeBoardState('Y', coords);
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