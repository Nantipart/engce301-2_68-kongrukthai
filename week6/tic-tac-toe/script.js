const X_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/x.png';
const O_IMAGE_URL = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1083533/circle.png';

let currentPlayer = 'X';

function handleClick(event) {
  const box = event.currentTarget;

  // สร้าง img
  const image = document.createElement('img');

  if (currentPlayer === 'X') {
    image.src = X_IMAGE_URL;
    currentPlayer = 'O';
  } else {
    image.src = O_IMAGE_URL;
    currentPlayer = 'X';
  }

  // ใส่รูปลงช่อง
  box.appendChild(image);

  // กันไม่ให้คลิกซ้ำ
  box.removeEventListener('click', handleClick);
}

// เพิ่ม event ให้ทุกช่อง
const boxes = document.querySelectorAll('#grid div');
for (const box of boxes) {
  box.addEventListener('click', handleClick);
}
