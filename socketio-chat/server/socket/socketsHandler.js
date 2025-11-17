import { authenticateSocket } from '../middleware/authMiddleware.js';
import { UserManager, MessageManager } from '../models/User.js';
import { MessageController } from '../controllers/messageController.js';
import { UserController } from '../controllers/userController.js';
import { TypingController } from '../controllers/typingController.js';

export default function socketHandler(io) {
  // Initialize managers
  const userManager = new UserManager();
  const messageManager = new MessageManager();
  
  // Initialize controllers
  const messageController = new MessageController(userManager, messageManager);
  const userController = new UserController(userManager);
  const typingController = new TypingController(userManager);

  // Socket.io middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User authentication and setup
    userController.handleUserJoin(socket, {
      userId: socket.userId,
      username: socket.username
    });

    // Message events
    socket.on('send_message', (data) => {
      messageController.handleSendMessage(socket, data);
    });

    socket.on('get_message_history', (room) => {
      messageController.handleGetMessageHistory(socket, room);
    });

    // Room events
    socket.on('join_room', (room) => {
      userController.handleJoinRoom(socket, room);
    });

    socket.on('leave_room', (room) => {
      userController.handleLeaveRoom(socket, room);
    });

    // Typing events
    socket.on('typing_start', (room) => {
      typingController.handleTypingStart(socket, room);
    });

    socket.on('typing_stop', (room) => {
      typingController.handleTypingStop(socket, room);
    });

    // Disconnection
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, reason);
      userController.handleUserLeave(socket);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  return io;
}