import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export interface User {
  name: string;
  email: string;
  id: string;
}

interface Props {
  chat: {
    members: string[];
  };
  user: User;
}

export const useFetchRecipientUser = ({ chat, user }: Props) => {
  const [recipientUser, setRecipientUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  const recipientId = chat?.members?.find((id) => {
    return id !== user?._id});

  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) {
        console.log('No recipientId found');
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
