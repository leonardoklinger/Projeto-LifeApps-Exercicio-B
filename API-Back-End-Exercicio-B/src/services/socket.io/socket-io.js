exports.run = async (app) => {
    const http = require('http').createServer(app);
    const io = require('socket.io')(http, {
        cors: {
            origins: ['http://localhost:8081']
        }
    });
    io.on('connection', (socket) => {
        exports.info = () => {
            return io
        }
    });
    http.listen(3000, () => {
        console.log('Servidor socket.io ligado');
    });
}