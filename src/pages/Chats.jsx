import React from 'react';
import ChatList from '../components/chat/ChatList';
import ChatBox from '../components/chat/ChatBox';

const Chats = () => {
  return (
    <div className="min-h-screen bg-[#030712] pt-48 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center justify-start">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-7xl h-[calc(100vh-250px)] min-h-[600px] bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10">
        <ChatList />
        <ChatBox />
      </div>
    </div>
  );
};

export default Chats;
