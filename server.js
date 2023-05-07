const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { Socket } = require('dgram');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, getRoomUsers,userLeave} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatbot'; 

// run when client connects
io.on('connection', socket => {
    console.log('New WS Connection...');
    socket.on('joinRoom', ({username, room})=> {

    //Welcome current user
    socket.emit('message',formatMessage (botName,'Welcome to chatroom!'));

    // Broadcast when a user connect
    socket.broadcast.emit('message',formatMessage (botName, 'A user has joined the chat'));
    });

    // Listen for chatMessage
    socket.on('chatMessage', msg =>{
        io.emit('message',formatMessage ('USER',  msg));
    });

       // Runs when client disconnects
      socket.on('disconnect', () =>{
        io.emit('message', formatMessage (botName,'A user has left the chat'));
    });

});



const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));