import { cargarSnake } from "./juegos/Snake/Snake.js";
import { cargarPingPong } from "./juegos/Ping Pong/Ping Pong.js";
import { cargarTetris} from "./juegos/Tetris/Tetris.js";
const juego = document.querySelectorAll('.juego');
const pantalla = document.querySelector('#pantalla');
const startButton = document.getElementById('iniciar');
const scoreDisplay = document.getElementById('Score');
const ctx = pantalla.getContext('2d');

juego.forEach((cadaJuego, i) => {
    juego[i].addEventListener('click', () => {
        juego.forEach((cadaJuego, i) => {
            juego[i].classList.remove('activo');
        });
        scoreDisplay.textContent = '0';
        juego[i].classList.add('activo');
        const nombreJuego = cadaJuego.textContent;

        ctx.clearRect(0, 0, pantalla.width, pantalla.height);

        

        if (nombreJuego === 'Snake') {
            if(window.currentGame && typeof window.currentGame.cancel === 'function') {
                window.currentGame.cancel();
            }
            window.currentGame = cargarSnake(pantalla,startButton,scoreDisplay);
        }
        else if (nombreJuego === 'Tetris') {
            if(window.currentGame && typeof window.currentGame.cancel === 'function') {
                window.currentGame.cancel();
            }
            window.currentGame = cargarTetris(pantalla,startButton,scoreDisplay);
        }
        else if (nombreJuego === 'Ping Pong') {
            if(window.currentGame && typeof window.currentGame.cancel === 'function') {
                window.currentGame.cancel();
            }
            window.currentGame = cargarPingPong(pantalla,startButton,scoreDisplay);
        }

    });
});