import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  Dispatch,
  SetStateAction,
  FormEvent,
  useEffect,
} from "react";
import { baseUrl, postRequest } from "../utils/services";

interface InfoProps {
  name: string;
  email: string;
  password: string;
}

interface Props {
  user: InfoProps | null;
  registerInfo: InfoProps;
  updateRegisterInfo: (info: InfoProps) => void;
  setUser: Dispatch<SetStateAction<null>>;
  registerUser: (e: FormEvent<HTMLFormElement>) => Promise<void>
  registerError: string
  registerLoading: boolean
}

export const AuthContext = createContext<Props>({
  registerInfo: { name: "", email: "", password: "" },
  updateRegisterInfo: () => null,
  setUser: () => null,
  user: null,
  registerUser: (e: FormEvent<HTMLFormElement>) => null, 
  registerError: '',
  registerLoading: false
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("User")

    if(user){
      setUser(JSON.parse(user))
    }
  } ,[])

  const updateRegisterInfo = useCallback((info: InfoProps) => {
    setRegisterInfo(info);
  }, []);

  const registerUser = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsRegisterLoading(true)
    setRegisterError('')

    
    const response = await postRequest(
      `${baseUrl}/users/register`,
      JSON.stringify(registerInfo)
      );
      
      setIsRegisterLoading(false)
      // if(response?.error){
        //   return setRegisterError(response?.message)
        // }
        
        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)
        }, [registerInfo]);
        
        console.log(user);
  const value: Props = { user, registerInfo, updateRegisterInfo, setUser, registerUser, registerError, registerLoading: isRegisterLoading };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
