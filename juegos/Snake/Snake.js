export function cargarSnake(pantalla,startButton,scoreDisplay) {
    const ctx = pantalla.getContext('2d');
    pantalla.width = 400;
    pantalla.height = 400;
    ctx.scale(20, 20);
    const boardColores = matriz(20,20,null);
    const snake = {shape : [[10,10],[10,9]], direction : {x:-1,y:0}};
    
    let colores = ['green', 'red'];
    
    comida();
    

    
    let lastTime = 0;
    let dropCounter = 0;
    let rafId = null;
    let stopped = false;

    function update(time = 0) {
        if (stopped) return;

        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;
        
        if(dropCounter > 500) {
            movimiento();
            dropCounter = 0;
        }
        draw();
        rafId = window.requestAnimationFrame(update);
    }

    update();
    
    function draw(){
        console.log(boardColores);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, pantalla.width, pantalla.height);
        // Dibujar celdas del tablero (comida, paredes, etc.)
        boardColores.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color !== null) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, 1, 1);
                }
            });
        });
        
        snake.shape.forEach(([y, x]) => {
            const isHead = (y === snake.shape[0][0] && x === snake.shape[0][1]);
            if (isHead) {
                ctx.fillStyle = (boardColores[y] && boardColores[y][x]) ? boardColores[y][x] : 'yellow';
                boardColores[y][x] = 'yellow';
            } else {
                ctx.fillStyle = (boardColores[y] && boardColores[y][x]) ? boardColores[y][x] : colores[0];
                boardColores[y][x] = colores[0];
            }
            ctx.fillRect(x, y, 1, 1);
        });
    }
    
    const keydownHandler = (event) => {
        switch(event.key){
            case 'ArrowUp':
                event.preventDefault();
                if (snake.direction.y === 1) break;
                snake.direction = {x: 0, y: -1};
                movimiento();
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (snake.direction.y === -1) break;
                snake.direction = {x: 0, y: 1};
                movimiento();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (snake.direction.x === 1) break;
                snake.direction = {x: -1, y: 0};
                movimiento();
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (snake.direction.x === -1) break;
                snake.direction = {x: 1, y: 0};
                movimiento();
                break;
        }
    };
    document.addEventListener('keydown', keydownHandler);
    startButton.addEventListener('click', startClickHandler);
    startClickHandler();

    function matriz(w, h,bool) {
        const matriz = [];
        while (h--) {
            matriz.push(new Array(w).fill(bool));
        }
        return matriz;
    }

    function cancel(){
        stopped = true;
        if (rafId) cancelAnimationFrame(rafId);
        // remove listeners
        document.removeEventListener('keydown', keydownHandler);
        if (startButton) startButton.removeEventListener('click', startClickHandler);
    }

    return { cancel };

    function movimiento(){
        const head = snake.shape[0];
        const newHead = [head[0] + snake.direction.y, head[1] + snake.direction.x];
        if(newHead[0] < 0) newHead[0] = 19;
        if(newHead[0] > 19) newHead[0] = 0;
        if(newHead[1] < 0) newHead[1] = 19;
        if(newHead[1] > 19) newHead[1] = 0;
        colicion(newHead);
        // Añadir nueva cabeza
        snake.shape.unshift(newHead);
        // Pintar la nueva cabeza en el board
        if (boardColores[newHead[0]]) boardColores[newHead[0]][newHead[1]] = colores[0];
        // Quitar la cola antigua (si ya no forma parte de la serpiente)
        const tail = snake.shape.pop();
        if (tail) {
            const stillPresent = snake.shape.some(seg => seg[0] === tail[0] && seg[1] === tail[1]);
            if (!stillPresent && boardColores[tail[0]]) {
                boardColores[tail[0]][tail[1]] = null;
            }
        }
        
    }

    function colicion(head){
        if(boardColores[head[0]][head[1]] === 'green'){
            alert('Game Over');
            document.removeEventListener('keydown', keydownHandler);
            stopped = true;
            
        }else if(boardColores[head[0]][head[1]] === 'red'){
            snake.shape.push(snake.shape[snake.shape.length - 1]);
            boardColores[head[0]][head[1]] = null;
            comida();
            scoreDisplay.textContent = parseInt(scoreDisplay.textContent) + 10;
        }
    }

    function comida(){
        let puting = true;
        while(puting){
            const x = Math.floor(Math.random() * 20);
            const y = Math.floor(Math.random() * 20);
            if(boardColores[y][x] === null){
                boardColores[y][x] = 'red';
                puting = false;
            }
        }
    }


    function startClickHandler() {
        // Reset snake position and direction
        snake.shape = [[10,10],[10,9]];
        snake.direction = {x: 0, y: -1};
        scoreDisplay.textContent = '0';
        ctx.clearRect(0, 0, pantalla.width, pantalla.height);
        boardColores.forEach(row => row.fill(null));
        // Pintar la serpiente inicial en el board antes de generar comida para evitar que la comida salga encima
        snake.shape.forEach(([y, x]) => {
            boardColores[y][x] = colores[0];
        });
        document.addEventListener('keydown', keydownHandler);
        comida();
        stopped = false;
        update();
    }

    
}