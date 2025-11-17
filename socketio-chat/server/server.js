import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import socketHandler from './socket/socketHandler.js';
import { socketConfig } from './config/socketConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, socketConfig);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.get('/api/rooms', (req, res) => {
  res.json({
    rooms: ['general', 'random', 'help', 'tech'],
    defaultRoom: 'general'
  });
});

// Initialize socket handling
socketHandler(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server initialized`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});