let currentPlayer = 'X';                   // X = คน, O = AI
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const statusDisplay = document.getElementById('status');
const cells = document.querySelectorAll('.cell');

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// เช็คว่าผู้เล่น player ชนะไหม
function checkWinner(player) {
    return winningConditions.some(cond => {
        const [a, b, c] = cond;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    // ให้คนเล่นได้เฉพาะตอนเป็นตา X เท่านั้น
    if (currentPlayer !== 'X') {
        return;
    }

    // ถ้าช่องนั้นไม่ว่าง หรือเกมจบแล้ว ไม่ต้องทำอะไร
    if (board[index] !== "" || !gameActive) {
        return;
    }

    makeMove(index, 'X');   // คนเดิน X

    // ถ้าเกมยังไม่จบ และถึงตา O (AI) -> ให้ AI เดิน
    if (gameActive && currentPlayer === 'O') {
        // หน่วงเวลานิดหน่อยให้ดูเหมือน AI คิดแป๊บหนึ่ง
        setTimeout(aiMove, 400);
    }
}

// ฟังก์ชันรวม ใช้เดินทั้งคนและ AI
function makeMove(index, player) {
    board[index] = player;

    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;

    // ใช้ Bootstrap class เปลี่ยนสี
    if (player === 'X') {
        cell.classList.add('text-danger', 'fw-bold');
    } else {
        cell.classList.add('text-primary', 'fw-bold');
    }

    checkResult(player);
}

function checkResult(playerJustMoved) {
    // เช็คผู้ชนะจาก player ที่เพิ่งเดิน
    if (checkWinner(playerJustMoved)) {
        statusDisplay.textContent = `ผู้เล่น ${playerJustMoved} ชนะ!`;
        gameActive = false;

        if (playerJustMoved === 'X') {
            scoreX++;
            scoreXEl.textContent = scoreX;
        } else {
            scoreO++;
            scoreOEl.textContent = scoreO;
        }
        return;
    }

    // เช็คว่าเสมอไหม (ไม่มีช่องว่างแล้ว)
    if (!board.includes("")) {
        statusDisplay.textContent = "เสมอ!";
        gameActive = false;
        scoreDraw++;
        scoreDrawEl.textContent = scoreDraw;
        return;
    }

    // ถ้ายังไม่จบเกม สลับผู้เล่น
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `ถึงตาผู้เล่น: ${currentPlayer}`;
}

// ให้ AI (O) เลือกช่องที่จะเดิน
function aiMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    const index = findBestMoveForO();
    if (index === null || index === undefined) return;

    makeMove(index, 'O');
}

// AI logic
function findBestMoveForO() {
    const emptyIndices = board
        .map((value, idx) => (value === "" ? idx : null))
        .filter(idx => idx !== null);

    if (emptyIndices.length === 0) return null;

    // 1) ถ้ามีช่องที่ O เดินแล้วชนะได้เลย ให้เดินตรงนั้น
    for (let i of emptyIndices) {
        board[i] = 'O';
        if (checkWinner('O')) {
            board[i] = ""; // ย้อนกลับ
            return i;
        }
        board[i] = "";
    }

    // 2) ถ้า X กำลังจะชนะ ตาถัดไป ให้กัน
    for (let i of emptyIndices) {
        board[i] = 'X';
        if (checkWinner('X')) {
            board[i] = "";
            return i; // กัน X ตรงนี้
        }
        board[i] = "";
    }

    // 3) เอากลางถ้าว่าง
    if (board[4] === "") {
        return 4;
    }

    // 4) ลองเอามุมก่อน
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // 5) ไม่งั้นสุ่มจากช่องที่เหลือ
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = 'X';
    statusDisplay.textContent = `ถึงตาผู้เล่น: ${currentPlayer}`;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('text-danger', 'text-primary', 'fw-bold');
    });
}

// ติด event ให้ทุก cell
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// ปุ่ม Reset
document.getElementById('resetBtn').addEventListener('click', resetGame);
