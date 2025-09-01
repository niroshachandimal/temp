import ChatUI from '../Chat/chatUI';
import ChatUIbody from '../Chat/ChatUIbody';

const ChatLayout = () => {
  return (
    <div className="flex justify-center lg:justify-start gap-6 p-4 h-[90vh]">
      {/* Left Side - Chat UI (UI with list of chats or contact list) */}
      <div className="w-full lg:w-[380px] rounded-xl overflow-hidden h-full">
        <ChatUI />
      </div>

      {/* Right Side - Chat Body (Main chat content and messages) */}
      <div className="w-full lg:w-[1280px]rounded-xl overflow-hidden h-full">
        <ChatUIbody />
      </div>
    </div>
  );
};

export default ChatLayout;
