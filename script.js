const gameBoard = (() => {
    let board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    return {board};
})();

const flowController = (() => {
    const xPlayer = createPlayer('Jim');
    const oPlayer = createPlayer('Bob');

    return {xPlayer, oPlayer};
})();

const createPlayer = (name) => {
    let isTurn = false;

    const report = () => isTurn;

    const toggleTurn = () => {
        isTurn = !isTurn;
    };

    return {name, report, toggleTurn};
};

const jim = createPlayer('jim');

console.log(jim.report());
jim.toggleTurn();
console.log(jim.report());
jim.toggleTurn();
console.log(jim.report());