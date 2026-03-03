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

    function playRound() {
        //prompt(`${xPlayer.name}: choose where to put your ${xPlayer.getMark()}`);
    };

    return {togglePlayerTurn, getPlayerXTurn, playRound};
})();

