export function cargarPingPong(pantalla,startButton,scoreDisplay) {
    const ctx = pantalla.getContext('2d');
    const ancho = 21;
    const alto = 21;
    pantalla.width = ancho * 21;
    pantalla.height = alto * 21;
    ctx.scale(ancho, alto);
    let board = matriz();
    let boardColores = new Array(alto).fill(null).map(() => new Array(ancho).fill(null));
    let rafId = null;
    let lanzamiento = "";
    let stopped = false;

    const pelota = {
        position: { x: 10, y: 10 },
        direction: { x: 1, y: 1 }
    };

    const jugador1 = {
        cheap : [[2],[2],[2]],
        position : {x:2,y:9},
        direction : {y:1}
    };

    const jugador2 = {
        cheap : [[2],[2],[2]],
        position : {x: ancho - 3,y:9},
        direction : {y:1}
    };

    let lastTime = 0;
    let dropCounter = 0;

    function update(time = 0){
        if (stopped) return;
        
        const deltaTime = time - lastTime;
        lastTime = time;
        dropCounter += deltaTime;

        if(dropCounter > 100) {
            console.log(board);
            moverPelota();
            bot();
            dropCounter = 0;
        }
        draw();
        rafId = requestAnimationFrame(update);

    }

    update();

    function draw(){
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, pantalla.width, pantalla.height);
        matrizColores(board);

        // Dibujar la pelota
        board[pelota.position.y][pelota.position.x] = 4;
        jugador1.cheap.forEach((valor, index) => {
            board[jugador1.position.y + index][jugador1.position.x] = jugador1.cheap[index][0];
        });
        jugador2.cheap.forEach((valor, index) => {
            board[jugador2.position.y + index][jugador2.position.x] = jugador2.cheap[index][0];
        });
    }

    const keydownHandler = (event) => {
        if(event.key === 'ArrowUp' && jugador1.position.y > 1){
            jugador1.position.y--;
            jugador1.direction.y = -1;
            board[jugador1.position.y + 3][jugador1.position.x] = 0;
        }
        if(event.key === 'ArrowDown' && jugador1.position.y < alto - 4){
            jugador1.position.y++;
            jugador1.direction.y = 1;
            board[jugador1.position.y - 1][jugador1.position.x] = 0;
        }
        if(event.key === "ArrowRight" && lanzamiento){
            pelota.direction = { x: 1, y: jugador1.direction.y };
            scoreDisplay.textContent = parseInt(scoreDisplay.textContent) + 100;
            lanzamiento = "";
        }
    };

    document.addEventListener('keydown', keydownHandler);
    startButton.addEventListener('click', startClickHandler);

    function moverPelota(){
        const positionX = pelota.position.x + pelota.direction.x;
        const nextX = board[pelota.position.y][pelota.position.x + pelota.direction.x];
        const nextY = board[pelota.position.y + pelota.direction.y][pelota.position.x];
        const nextXY = board[pelota.position.y + pelota.direction.y][pelota.position.x + pelota.direction.x];

        if(nextY === 1 )pelota.direction.y *= -1;
        if(nextX === 2 || nextXY === 2 && nextX === 0) pelota.direction.x *= -1;
        if(nextXY === 2 && nextX === 0) pelota.direction.y *= -1;
        board[pelota.position.y][pelota.position.x] = 0;
        if (positionX === 0 || positionX === ancho - 1 || lanzamiento !== "") {
            pelota.direction = { x: 0, y: 0 };

            if (positionX === 0 || lanzamiento === "jugador2") {
                lanzamiento = "jugador2";

                // Asegura que el bot tenga dirección vertical inicial
                if (!jugador2.direction.y) jugador2.direction.y = 1;

                // Si llegó a los bordes, invierte la dirección
                if (jugador2.position.y <= 1) jugador2.direction.y = 1;
                if (jugador2.position.y >= alto - 5) jugador2.direction.y = -1;

                // Mueve el bot un paso en la dirección actual
                jugador2.position.y += jugador2.direction.y;

                // Limpia la posición anterior
                if (jugador2.direction.y === -1) {
                    board[jugador2.position.y + 3][jugador2.position.x] = 0;
                    jugador2.direction.y = -1;
                } else {
                    board[jugador2.position.y - 1][jugador2.position.x] = 0;
                    jugador2.direction.y = 1;
                }

                // Posiciona la pelota junto al bot
                pelota.position = { x: jugador2.position.x - 1, y: jugador2.position.y + 2 };

                // Lanza la pelota después de un pequeño retraso
                setTimeout(() => {
                    pelota.direction = { x: -1, y: jugador2.direction.y };
                    lanzamiento = "";
                }, 300);
            } else {
                lanzamiento = "jugador1";
                pelota.position = { x: jugador1.position.x + 1, y: jugador1.position.y + 1 };
            }
        }

        
        pelota.position.x += pelota.direction.x;
        pelota.position.y += pelota.direction.y;
    }

    function bot() {
        // Solo mover el bot si la pelota está en su mitad del campo y viene hacia él
        if (pelota.position.x > ancho * 0.50 && pelota.direction.x !== -1) {

            // Mover hacia la pelota, pero mantener límites
            if (pelota.position.y > jugador2.position.y + 1 && jugador2.position.y < alto - 4) {
                jugador2.position.y++;
                jugador2.direction.y = 1;
            } else if (pelota.position.y < jugador2.position.y && jugador2.position.y > 1) {
                jugador2.position.y--;
                jugador2.direction.y = -1;
            }

            // Limitar los bordes por seguridad
            if (jugador2.position.y < 0) jugador2.position.y = 0;
            if (jugador2.position.y > alto - 4) jugador2.position.y = alto - 4;

            // Limpiar posiciones anteriores
            if ( jugador2.direction.y === -1)
                board[jugador2.position.y + 3][jugador2.position.x] = 0;
            else
                board[jugador2.position.y - 1][jugador2.position.x] = 0;
        }
    }


    

    function matrizColores(matriz){
        matriz.forEach ((fila , y) =>{
            fila.forEach((valor, x ) =>{
                if(valor !== 0){
                    boardColores[x][y] = { color: 'white' };
                }
                else{
                    boardColores[x][y] = { color: 'black' };
                }
                ctx.fillStyle = boardColores[x][y].color;
                ctx.fillRect(x, y, 1, 1);
            })
        });
    }

    function cancel(){
        if (rafId) cancelAnimationFrame(rafId);
        stopped = true;
        document.removeEventListener('keydown', keydownHandler);
        if (startButton) startButton.removeEventListener('click', startClickHandler);
    }
    return { cancel };

    function startClickHandler() {
        board = matriz();
        boardColores = board.map(row => row.map(() => null));
        pelota.position = { x: 10, y: 10 };
        pelota.direction = { x: 1, y: 1 };
        jugador1.position = {x:2,y:9};
        jugador2.position = {x: ancho - 3,y:9};
        scoreDisplay.textContent = '0';
        lanzamiento = "";
        document.addEventListener('keydown', keydownHandler);
        stopped = false;
        update();
    }

    function matriz(){
        const filas = ancho;
        const columnas = alto;
        const mat = [];
        for(let i=0; i<columnas; i++){
            if( i === 0 || i === columnas -1){
                mat.push(new Array(filas).fill(1));
            }
            else{
                const row = new Array(filas).fill(0);
                row[0] = 1;
                row[filas -1] = 1;
                mat.push(row);
            }

        }
        return mat;
    }
}