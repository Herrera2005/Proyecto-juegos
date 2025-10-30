export function cargarPingPong(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(10, 200, 10, 100);
    ctx.fillRect(780, 200, 10, 100);
    ctx.font = '24px Arial';
    ctx.fillText('Juego Ping Pong cargado', 50, 50);
}