
export function cargarTetris(pantalla,startButton,scoreDisplay){
const ctx = pantalla.getContext('2d');

const BlockSize = 30; // Tamaño de cada bloque
const boardWidth = 14; // Ancho del tablero en bloques
const boardHeight = 28; // Alto del tablero en bloques

pantalla.width = BlockSize * boardWidth;
pantalla.height = BlockSize * boardHeight;

ctx.scale(boardWidth*2, boardHeight);

const board = matriz(boardWidth, boardHeight);
const boardColores = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(null));

const piece = {
  shape: [
    [1, 1, 0],
    [1, 1, 0]
  ],
  position: { x: 4, y: 0 }
};
let colores = ['blue', 'red', 'green', 'yellow', 'purple', 'cyan', 'orange'];

let color = 'blue';
const pieces =[
  [
    [1, 1, 0],
    [1, 1, 0]
  ],[
    [0,1,0],
    [1,1,1]
  ],[
    [0,1,1],
    [1,1,0]
  ],[
    [1,1,0],
    [0,1,1]
  ],[
    [1,0,0],
    [1,1,1]
  ],[
    [1,1,1],
    [1,0,0]
  ],[[1,1,1,1]]
];

let lastTime = 0;
let dropCounter = 0;
let rafId = null;
let stopped = false;

function update(time = 0){
  if (stopped) return; // stop if canceled
  const deltaTime = time - lastTime;
  lastTime = time;

  dropCounter += deltaTime;
  if(dropCounter > 700 && scoreDisplay.textContent < 100){
    piece.position.y++;
    dropCounter = 0;
  } else if(dropCounter > 500 && scoreDisplay.textContent >= 100 && scoreDisplay.textContent < 200){
    piece.position.y++;
    dropCounter = 0;
  } else if(dropCounter > 300 && scoreDisplay.textContent >= 200){
    piece.position.y++;
    dropCounter = 0;
  }
  if(colision()){
    piece.position.y--;
    fijarPieza();
  }

  draw();
  rafId = window.requestAnimationFrame(update);
}

function draw(){
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, boardWidth, boardHeight);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value !== 0){
        const colorCelda = (boardColores[y] && boardColores[y][x]) ? boardColores[y][x] : 'white';
        ctx.fillStyle = colorCelda;
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1){
        ctx.fillStyle =boardColores[y + piece.position.y][x + piece.position.x] || color;
        ctx.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
}

const startClickHandler = () => {
  for (let y = 0; y < boardHeight; y++) {
    board[y].fill(0);
    boardColores[y].fill(null);
  }
  piece.position = { x: 4, y: 0 };
  scoreDisplay.textContent = '0';
  // reset timing
  lastTime = 0;
  dropCounter = 0;
};
startButton.addEventListener('click', startClickHandler);

const keydownHandler = (event) => {
  if(event.key === 'ArrowLeft'){
    piece.position.x--;
    if(colision())piece.position.x++;
  }
  else if(event.key === 'ArrowRight'){
    piece.position.x++;
    if(colision())piece.position.x--;
  }
  else if(event.key === 'ArrowDown'){
    piece.position.y++;
    if(colision()){
      piece.position.y--;
      fijarPieza();
    }
  }
  else if(event.key === 'ArrowUp'){
    event.preventDefault();
    const nuevaForma = piece.shape[0].map((_, i) =>
      piece.shape.map(row => row[i]).reverse()
    );
    const posicionOriginal = piece.position.x;
    piece.shape = nuevaForma;
    if(colision()) {
      piece.position.x = posicionOriginal;
      piece.shape = nuevaForma[0].map((_, i) =>
        nuevaForma.map(row => row[i]).reverse());
    }
  }
};
document.addEventListener('keydown', keydownHandler);

function colision(){
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
      return (value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0);
    });
  });
}
update();

function cancel(){
  stopped = true;
  if (rafId) cancelAnimationFrame(rafId);
  // remove listeners
  document.removeEventListener('keydown', keydownHandler);
  if (startButton) startButton.removeEventListener('click', startClickHandler);
}

// Devolver un objeto con cancel para que la página pueda detener el juego
return { cancel };

function fijarPieza() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
        boardColores[y + piece.position.y][x + piece.position.x] = color;
      }
    });
  });
  //
  const randomIndex = Math.floor(Math.random() * colores.length);
  color = colores[randomIndex];
  piece.shape = pieces[randomIndex ];
  piece.position.y = 0;
  piece.position.x = Math.floor(boardWidth / 2);
  
  eliminarLinea();
}

function eliminarLinea() {
  let lineasEliminadas = 0;
  board.forEach((row,y) =>{
    const completa = row.every(cell => cell !== 0);
    if(completa){
      board.splice(y, 1);
      board.unshift(new Array(boardWidth).fill(0));

      boardColores.splice(y, 1);
      boardColores.unshift(Array(boardWidth).fill(null));
      lineasEliminadas++;
    }else {
      y--; 
    }
  });
  if(lineasEliminadas >= 4) lineasEliminadas = 5;
  scoreDisplay.textContent = parseInt(scoreDisplay.textContent) + 10*lineasEliminadas;
}

function matriz(w, h) {
    const matriz = [];
    while (h--) {
      matriz.push(new Array(w).fill(0));
    }
    return matriz;
}


}