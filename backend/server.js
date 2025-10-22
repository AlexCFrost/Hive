const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const http = require('http');
const socketIo = require('socket.io');

const userRoutes = require("./Routes/userRoutes");
const communityRoutes = require('./Routes/CommunityRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const setupSocketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", process.env.FRONTEND_URL], 
  credentials: true
}));
app.use(passport.initialize());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

// Routes
app.use('/bee/user', userRoutes);
app.use('/bee/community', communityRoutes);
app.use('/bee/message', messageRoutes);

// Initialize Socket.IO
const io = setupSocketHandler(server);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`Connected to Database: `, process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });