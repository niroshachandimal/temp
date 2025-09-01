import { ChatProvider, Chat as ChatUi, initChatConfig, } from '@pubuduth-aplicy/chat-ui';

const Chat = () => {
  initChatConfig({
    apiUrl: `http://3.98.96.192:3030/`,
    role: 'customer',
  });
  return (
    <div>
     <ChatProvider userId="660852277c7e0978869f4c15">
      <ChatUi />
    </ChatProvider>
    </div>
  );
};

export default Chat;
