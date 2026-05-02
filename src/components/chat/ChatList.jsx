import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { HiChatAlt2, HiSearch, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const ChatList = () => {
  const { chats, selectedChat, setSelectedChat } = useChat();
  const { user } = useAuth();

  const getOtherUser = (participants) => {
    const currentUserId = user?._id || user?.id;
    return participants.find((p) => (p._id || p).toString() !== currentUserId?.toString());
  };

  return (
    <div className="flex flex-col h-full bg-white/5 border-r border-white/10 w-full md:w-96 backdrop-blur-md">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white italic">Inbox <span className="text-indigo-500">.</span></h2>
          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
            <HiChatAlt2 className="text-indigo-400" />
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <HiSearch className="text-slate-500" />
          </div>
          <input 
            type="text" 
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium"
          />
        </div>
      </div>

      <div className="flex-grow overflow-y-auto custom-scrollbar px-2 py-4 space-y-2">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50 px-8 text-center pb-12">
            <div className="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-6 animate-float">
               <HiChatAlt2 size={36} className="text-indigo-500" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/90 mb-2">Silence is Golden</p>
            <p className="text-xs font-medium leading-relaxed mb-8">But finding a home is better. Start a conversation with an owner today.</p>
            <Link 
              to="/explore" 
              className="px-6 py-3 bg-white text-[#030712] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
            >
              Start Exploring <HiArrowRight />
            </Link>
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherUser(chat.participants);
            const isSelected = selectedChat?._id === chat._id;
            
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 mx-2 cursor-pointer rounded-3xl transition-all duration-300 relative group ${
                  isSelected 
                    ? 'bg-indigo-600 shadow-xl shadow-indigo-600/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-600/20 text-indigo-400'
                  }`}>
                    {otherUser?.name?.charAt(0)}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-black truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                        {otherUser?.name}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className={`text-xs truncate font-medium ${isSelected ? 'text-indigo-100/70' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {chat.lastMessage ? chat.lastMessage.content : 'New conversation started'}
                    </p>
                    {chat.property && !isSelected && (
                      <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block">
                        {chat.property.title}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
