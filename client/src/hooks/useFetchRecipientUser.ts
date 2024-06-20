import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";
import { UserChat } from "../context/ChatContext";
import { UserProps } from "../context/AuthContext";


interface Props {
  chat: UserChat | null
  user: UserProps | null
}

export const useFetchRecipientUser = ({ chat, user }: Props) => {
  const [recipientUser, setRecipientUser] = useState<UserProps | null>(null);
  const [error, setError] = useState('');

  const recipientId = chat?.members?.find((id) => {
    return id !== user?._id});

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        return;
      }

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);


      if (response.error) {
        return setError(response.message);
      }
      setRecipientUser(response);
    };
    getUser();
  }, [recipientId]);


  return { recipientUser, error };
};
