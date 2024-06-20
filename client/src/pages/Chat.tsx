import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import { Container, Stack } from "react-bootstrap"
import UserChatProps from "../components/chat/UserChat"
import { AuthContext } from "../context/AuthContext"
import PotentialChats from "../components/chat/PotentialChats"
import ChatBox from "../components/chat/ChatBox"

const Chat = () => {
  const {userChats, isUserChatsLoading, updateCurrentChat} = useContext(ChatContext)
  const {user} = useContext(AuthContext)

  return (
    <Container>
      <PotentialChats/>
      {userChats && userChats?.length < 1 ? null : <Stack direction='horizontal' className="align-items-start" gap={4}>
        <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
        {isUserChatsLoading && <p>Loading chats...</p>}
        {userChats && userChats?.map((chat, index) => (
          <div onClick={() => {updateCurrentChat(chat)}} key={index}>
            <UserChatProps chat={chat} user={user} />
          </div>
        ))}
        </Stack>
        <ChatBox/>
        </Stack>}
    </Container>
  )
}

export default Chat