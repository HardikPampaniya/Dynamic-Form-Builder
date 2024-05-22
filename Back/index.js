const express = require("express")
const cors = require('cors');
const routes = require('../routes/allRoutes.js');
const { createServer } = require('http');
const { Server} = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', routes);

const httpServer = createServer(app);
const io = new Server(httpServer , {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Handle chat messages
    socket.on('chatMessage', (msg) => {
        console.log('message: ' + msg);
        // Broadcast the message to all connected clients
        io.emit('chatMessage', msg);
    });
});

httpServer.listen(5000, () => {
    console.log("Server running ");
});
