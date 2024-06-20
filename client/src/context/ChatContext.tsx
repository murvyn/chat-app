import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { UserProps } from "./AuthContext";

interface MessagesProps {
  chatId: string;
  text: string;
  _id: string;
  senderId: string
  createdAt: string
}

export interface UserChat {
  members: string[];
  _id: string;
}
interface Props {
  userChats: UserChat[] | null;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  potentialChats: UserChat[] | null;
  createChat: (firstId: string, secondId: string) => Promise<void>;
  currentChat: UserChat | null;
  updateCurrentChat: (chat: UserChat) => void;
  messages: MessagesProps[] | null;
  isMessagesLoading: boolean;
  messagesError: string;
  sendTextMessage: (
    textMessage: string,
    sender: string,
    currentChatId: string,
    setTextMessage: (text: string) => void
  ) => Promise<void>;
}

export const ChatContext = createContext<Props>({
  isUserChatsLoading: false,
  userChats: null,
  userChatsError: null,
  potentialChats: null,
  createChat: () => Promise.resolve(),
  currentChat: null,
  updateCurrentChat: () => null,
  messages: null,
  isMessagesLoading: false,
  messagesError: "",
  sendTextMessage: () => Promise.resolve(),
});

export const ChatContextProvider = ({
  children,
  user,
}: {
  children: ReactNode;
  user: UserProps;
}) => {
  const [userChats, setUserChats] = useState<UserChat[] | null>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState(null);
  const [currentChat, setCurrentChat] = useState<UserChat | null>(null);
  const [messages, setMessages] = useState<MessagesProps[] | null>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [sendTextMessageError, setSendTextMessageError] = useState("");
  const [newMessage, setNewMessage] = useState<MessagesProps | null>(null);

  console.log(sendTextMessageError, newMessage)

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter((u: UserProps) => {
        let isChatCreated = false;

        if (user?._id === u?._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat: UserChat) => {
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

  const updateCurrentChat = useCallback((chat: UserChat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError('');

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: string,
      currentChatId: string,
      setTextMessage: (text: string) => void
    ) => {
      if (!textMessage) return console.log("You must type something..");

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender,
          text: textMessage,
        })
      );

      if (response.error) {
        return setSendTextMessageError(response.message);
      }

      setNewMessage(response);
      setMessages((prev: MessagesProps[] | null) =>
        prev ? [...prev, response] : [response]
      );
      console.log(response);
      setTextMessage("");
    },
    []
  );

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev: UserChat[] | null) =>
      prev ? [...prev, response] : [response]
    );
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
    messagesError,
    sendTextMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
