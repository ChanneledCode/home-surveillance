const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

const SECRET_KEY = 'your-secret-key';

// Add WebSocket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.id;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
  
    // Handle WebRTC offer from surveillance device
    socket.on('webrtc-offer', (data) => {
      // Forward the offer to the monitoring client
      socket.broadcast.emit('webrtc-offer', data);
    });
  
    // Handle WebRTC answer from monitoring client
    socket.on('webrtc-answer', (data) => {
      // Forward the answer back to the surveillance device
      socket.broadcast.emit('webrtc-answer', data);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
