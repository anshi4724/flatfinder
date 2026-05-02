import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { HiPaperAirplane, HiInformationCircle } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const ChatBox = () => {
  const { selectedChat, messages, fetchMessages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await sendMessage(newMessage, selectedChat._id);
    setNewMessage('');
  };

  if (!selectedChat) {
    return (
      <div className="flex-grow flex items-center justify-center bg-transparent text-slate-500">
        <div className="text-center p-12 max-w-sm">
          <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8 animate-float shadow-2xl shadow-indigo-500/10">
            <svg className="h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-white italic mb-3">Your <span className="text-indigo-500">Sanctuary</span> awaits.</h3>
          <p className="text-sm font-medium leading-relaxed">Select a conversation from the left to start coordinating your next move.</p>
        </div>
      </div>
    );
  }

  const currentUserId = user?._id || user?.id;
  const otherUser = selectedChat.participants.find(
    (p) => (p._id || p).toString() !== currentUserId?.toString()
  );

  return (
    <div className="flex-grow flex flex-col h-full bg-white/[0.02]">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between backdrop-blur-xl bg-white/[0.03] sticky top-0 z-10">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-black text-xl shadow-xl">
              {otherUser?.name?.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#030712]"></div>
          </div>
          <div className="ml-4">
            <h2 className="font-black text-white text-lg tracking-tight">{otherUser?.name}</h2>
            <div className="flex items-center gap-1.5">
               <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Active Now</span>
               <span className="w-1 h-1 rounded-full bg-slate-600"></span>
               {selectedChat.property && (
                 <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest truncate max-w-[150px]">
                    {selectedChat.property.title}
                 </span>
               )}
            </div>
          </div>
        </div>
        
        <button className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10">
           <HiInformationCircle size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,_rgba(99,102,241,0.03)_0%,_transparent_100%)]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => {
            const msgSenderId = msg.sender?._id || msg.sender;
            const isOwn = msgSenderId?.toString() === currentUserId?.toString();
            return (
              <motion.div 
                key={msg._id || index}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] group flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-5 py-3.5 rounded-[1.5rem] shadow-2xl transition-all duration-300 ${
                      isOwn
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white/10 backdrop-blur-md text-white border border-white/10 rounded-bl-none'
                    }`}
                  >
                    <p className="text-[14px] font-medium leading-relaxed">{msg.content}</p>
                  </div>
                  <span className={`text-[9px] mt-1.5 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${
                    isOwn ? 'text-indigo-400' : 'text-slate-500'
                  }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-8 bg-transparent border-t border-white/5">
        <form onSubmit={handleSend} className="relative group">
          <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="relative flex items-center bg-white/5 border border-white/10 p-2 pl-6 rounded-[2rem] backdrop-blur-3xl transition-all group-focus-within:border-indigo-500/50 group-focus-within:bg-white/10">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Draft your next message..."
              className="flex-grow bg-transparent border-none text-white text-sm outline-none placeholder-slate-600 font-medium py-3"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-[1.2rem] shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale group cursor-pointer"
            >
              <HiPaperAirplane className="h-5 w-5 rotate-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </form>
        <p className="text-[9px] text-center mt-4 text-slate-600 font-black uppercase tracking-[0.2em] pointer-events-none">
           Powered by FlatFinder Real-Time Mesh
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
