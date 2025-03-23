const socketHandler = (socket) => {
    console.log('New client connected');
  
    socket.on('joinRoom', (communityId) => {
      socket.join(communityId);
    });
  
    socket.on('leaveRoom', (communityId) => {
      socket.leave(communityId);
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  };
  
  module.exports = socketHandler;