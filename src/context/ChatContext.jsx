import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

const ChatContext = createContext();

const ENDPOINT = 'http://localhost:5003'; // Match backend port

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(ENDPOINT);
      setSocket(newSocket);

      newSocket.emit('setup', user);
      newSocket.on('connected', () => setSocketConnected(true));

      return () => newSocket.disconnect();
    }
  }, [user]);

  const fetchChats = useCallback(async () => {
    try {
      const { data } = await API.get('/chats');
      setChats(data);
    } catch (error) {
      toast.error('Failed to load chats');
    }
  }, []);

  const fetchMessages = useCallback(async (chatId) => {
    try {
      const { data } = await API.get(`/chats/${chatId}/messages`);
      setMessages(data);
      if (socket) {
        socket.emit('join chat', chatId);
      }
    } catch (error) {
      toast.error('Failed to load messages');
    }
  }, [socket]);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user, fetchChats]);

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chatId._id) {
        // Notification logic could go here
        fetchChats(); // Refresh list to show last message
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    };

    socket.on('message received', handleMessageReceived);

    return () => {
      socket.off('message received', handleMessageReceived);
    };
  }, [socket, selectedChat, fetchChats]);

  const sendMessage = async (content, chatId) => {
    try {
      const { data } = await API.post('/chats/messages', { content, chatId });
      setMessages((prev) => [...prev, data]);
      if (socket) {
        socket.emit('new message', data);
      }
      fetchChats(); // Refresh list to update last message
      return data;
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        selectedChat,
        setSelectedChat,
        messages,
        setMessages,
        fetchMessages,
        sendMessage,
        socket,
        socketConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
