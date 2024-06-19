import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // chats: any[];
  // messages: any[];
  // friends: any[];
  // requests: any[];
  // blocked: any[];
  // blockedBy: any[];
  isOnline: boolean;
  isTyping: boolean;
  lastActive: string;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSender: string;
  lastMessageSenderId: string;
  lastMessageSenderName: string;
  lastMessageSenderAvatar: string;
  lastMessageSenderIsOnline: boolean;
  lastMessageSenderIsTyping: boolean;
  lastMessageSenderLastActive: string;
  lastMessageSenderLastMessage: string;
  lastMessageSenderLastMessageAt: string;
  lastMessageSenderLastMessageSender: string;
  lastMessageSenderLastMessageSenderId: string;
}

interface Chat {
  members: string[];
}

interface UserChat {
  chat: Chat[];
}
interface Props {
  userChats: UserChat[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  potentialChats: UserChat[] | null;
  createChat: (firstId: string, secondId: string) => Promise<void>;
  currentChat: Chat | null
  updateCurrentChat: (chat: Chat) => void
}

export const ChatContext = createContext<Props>({
  isUserChatsLoading: false,
  userChats: null,
  userChatsError: null,
  potentialChats: null,
  createChat: () => null,
  currentChat: null,
  updateCurrentChat: () => null
});

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User;
}) => {
  const [userChats, setUserChats] = useState<UserChat[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null)
  const [isMessagesLoading, setIsMessagesLoading] = useState(null)
  const [messagesError, setMessagesError] = useState(null)


  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter((u: User) => {
        let isChatCreated = false;

        if (user?._id === u?._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat: Chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, [])
  
  useEffect(() => {
    const getMessages = async () => {
        setIsMessagesLoading(true);
        setMessagesError(null);

        const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
        

        setIsMessagesLoading(false);

        if (response.error) {
          return setMessagesError(response);
        }

        setMessages(response);
    };
    getMessages();
  }, [currentChat]);


  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev: any) => [...prev, response]);
    console.log(firstId, secondId);
  }, []);

  const value: Props = {
    userChats,
    isUserChatsLoading,
    userChatsError,
    potentialChats,
    createChat,
    currentChat,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    messagesError
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
