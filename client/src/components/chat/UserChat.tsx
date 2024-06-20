import { useFetchRecipientUser } from "../../hooks/useFetchRecipientUser";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { ChatContext, type UserChat } from "../../context/ChatContext";
import type { UserProps } from "../../context/AuthContext";
import { useContext } from "react";

interface Props {
  chat: UserChat
  user: UserProps | null
}

const UserChat = ({ chat, user }: Props) => {
  const { recipientUser } = useFetchRecipientUser({chat, user});
  const {onlineUsers} = useContext(ChatContext)

  const isOnline= onlineUsers?.some(user => user.userId === recipientUser?._id)

  return (
    <Stack
      direction="horizontal"
      gap={5}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} alt="profile" height="35px" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text Message</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">12/12/2022</div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ? "user-online" : "" }/>
      </div>
    </Stack>
  );
};

export default UserChat;
