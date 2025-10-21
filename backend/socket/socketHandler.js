const socketIO = require('socket.io');

const socketHandler = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    // Add token verification logic here if needed
    next();
  });

  io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    socket.on('joinRoom', (communityId) => {
      console.log(`User joining community room: ${communityId}`);
      socket.join(communityId);
    });

    socket.on('sendMessage', (data) => {
      console.log('Message received:', data);
      io.to(data.communityId).emit('newMessage', data.message);
    });

    socket.on('leaveRoom', (communityId) => {
      console.log(`User leaving community room: ${communityId}`);
      socket.leave(communityId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected', socket.id);
    });
  });

  return io;
};

module.exports = socketHandler;
