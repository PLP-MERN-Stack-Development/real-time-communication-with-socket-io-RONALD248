import React from 'react';
import { SocketProvider, useSocket } from './context/SocketContext';
import LoginForm from './components/LoginForm';
import ChatRoom from './components/ChatRoom';
import './App.css';

function AppContent() {
  const { user } = useSocket();

  return (
    <div className="App">
      {user ? <ChatRoom /> : <LoginForm />}
    </div>
  );
}

function App() {
  return (
    <SocketProvider>
      <AppContent />
    </SocketProvider>
  );
}

export default App;