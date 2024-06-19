import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
  const { potentialChats, createChat } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="all-users">
      {potentialChats &&
        potentialChats?.map((u, index) => (
          <div onClick={() => createChat(user?._id, u?._id)} key={index} className="single-user">
            {u.name}
            <span className="user-onine" />
          </div>
        ))}
    </div>
  );
};

export default PotentialChats;
