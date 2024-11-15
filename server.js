const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  // Listen for joining a room
  socket.on('join', roomId => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendmesssage', roomId,userid,message => {
    socket.join(userid);
    //udate the data on the userid in database
    socket.emit('recievedmessage',userid,message)
  });

  socket.on('typing', (roomId) => {
    socket.to(roomId).emit('typing', { roomId, isTyping: true });
  });
  
  socket.on('stop-typing', (roomId) => {
    socket.to(roomId).emit('typing', { roomId, isTyping: false });
  });


  // Listen for leaving a room
  socket.on('leave', roomId => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  // Handle offer and broadcast to specific room
  socket.on('offer', (data) => {
    console.log('Offer received, broadcasting to room:', data.roomId);
    socket.to(data.roomId).emit('offer', data);
  });

  // Handle answer and broadcast to specific room
  socket.on('answer', (data) => {
    console.log('Answer received, broadcasting to room:', data.roomId);
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  socket.on('ice-candidate', (data) => {
    console.log('ICE candidate received, broadcasting to room:', data.roomId);
    socket.to(data.roomId).emit('ice-candidate', data.candidate);
  });
});


const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
