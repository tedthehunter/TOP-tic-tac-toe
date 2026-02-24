const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getBoardState = () => board;

    const changeBoardState = (mark, coords) => {
        board[coords[0]][coords[1]] = mark;
    }

    return {getBoardState, changeBoardState};
})();

const createPlayer = (name, mark) => {
    const getMark = () => mark;

    return {name, getMark};
};

const flowController = (() => {
    const xPlayer = createPlayer('Jim', 'X');
    const oPlayer = createPlayer('Bob', 'O');

    return {xPlayer, oPlayer};
})();

console.log(gameBoard.getBoardState());

gameBoard.changeBoardState('X', [0, 0]);

console.log(gameBoard.getBoardState());