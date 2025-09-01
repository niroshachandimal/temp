import { ChatProvider, Chat, initChatConfig } from "@pubuduth-aplicy/chat-ui";
// import { useAuth } from "react-oidc-context";

const ChatUi = () => {
  // const auth = useAuth();

   initChatConfig({
    apiUrl: `http://localhost:3030`,
    role: 'provider',
  });
  return (
    <div>
      <ChatProvider userId="6672e82c16fb72bf05ddf75e">
      {/* <ChatProvider userId="663767972ea46a2a2ea14b9b"> */}
        <Chat />
      </ChatProvider>
    </div>
  );
};

export default ChatUi;
