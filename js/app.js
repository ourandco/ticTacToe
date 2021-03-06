/* eslint-disable no-plusplus, no-return-assign, no-use-before-define,
import/extensions, implicit-arrow-linebreak, operator-linebreak  */
import * as elements from './DOMelements.js';
import board from './board.js';
import playerFactory from './playerFactory.js';
import inputIsValid from './utils.js';

const game = (gameBoard, p1, p2) => {
  const board = gameBoard();
  const player1 = playerFactory(p1 || 'Player One', 'X');
  const player2 = playerFactory(p2 || 'Player Two', 'O');
  elements.playerOne.textContent = `${player1.name} is ${player1.mark}`;
  elements.playerTwo.textContent = `${player2.name} is ${player2.mark}`;
  let currentPlayer = player1;

  const changePlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };
    // check for end game
  const checkEndGame = () => {
    if (playerHasWon(currentPlayer) || gameIsDraw()) endGame();
  };

  const endGame = () =>
    showEndModal() && elements.grid.replayEventListener('click', game.play);

  const playerHasWon = player => {
    let res;
    board.getWinLines().forEach(line => {
      if (line.every(spot => board.getField()[spot] === player.mark)) {
        elements.winner.textContent = `Congratulations ${currentPlayer.name} you won!`;
        res = true;
      }
    });
    return res;
  };

  const gameIsDraw = () => {
    let res;

    if (
      board.getField().every(spot => spot !== null) &&
        !playerHasWon(currentPlayer)
    ) {
      elements.winner.textContent = 'The game is draw. Want a rematch?';
      res = true;
    }
    return res;
  };

  const showEndModal = () => {
    elements.endModal.style.display = 'grid';
  };

  const play = ({ target: { dataset: { cellIdx } } }) => {
    const { mark } = currentPlayer;
    if (!inputIsValid(board, cellIdx)) return;
    board.writeToField(cellIdx, mark);
    checkEndGame(board);
    changePlayer();
    elements.render(board);
  };

  return { play };
};

elements.startButton.addEventListener('click', () => {
  const newGame = game(board, elements.playerOneInput.value, elements.playerTwoInput.value);
  elements.grid.addEventListener('click', newGame.play);
});
export default board;
