const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

const boxes = document.querySelectorAll('#grid div');
const restartBtn = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// ================= PLAYER =================
function handlePlayerClick(event) {
  const box = event.currentTarget;
  const index = [...boxes].indexOf(box);

  if (board[index] !== '' || gameOver) return;

  placeMark(box, index, 'X');

  if (checkWinner(board, 'X')) {
    alert('You win!');
    gameOver = true;
    return;
  }

  if (isDraw(board)) {
    alert('Draw!');
    gameOver = true;
    return;
  }

  setTimeout(aiMove, 300);
}

// ================= AI (MINIMAX) =================
function aiMove() {
  if (gameOver) return;

  let bestScore = -Infinity;
  let move;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  placeMark(boxes[move], move, 'O');

  if (checkWinner(board, 'O')) {
    alert('AI wins!');
    gameOver = true;
  } else if (isDraw(board)) {
    alert('Draw!');
    gameOver = true;
  }
}

// ================= MINIMAX =================
const scores = {
  O: 1,
  X: -1,
  draw: 0
};

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, 'O')) return scores.O;
  if (checkWinner(board, 'X')) return scores.X;
  if (isDraw(board)) return scores.draw;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// ================= COMMON =================
function placeMark(box, index, player) {
  const img = document.createElement('img');
  img.src = player === 'X' ? X_IMAGE_URL : O_IMAGE_URL;
  box.appendChild(img);
  board[index] = player;
}

function checkWinner(board, player) {
  return winPatterns.some(pattern =>
    pattern.every(i => board[i] === player)
  );
}

function isDraw(board) {
  return board.every(cell => cell !== '');
}

// ================= RESTART =================
function restartGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;
  boxes.forEach(box => box.innerHTML = '');
}

// ================= INIT =================
boxes.forEach(box => box.addEventListener('click', handlePlayerClick));
restartBtn.addEventListener('click', restartGame);
