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
  name?: string;
  email: string;
  password: string;
}

interface Props {
  user: InfoProps | null;
  registerInfo: InfoProps;
  loginInfo: InfoProps;
  updateRegisterInfo: (info: InfoProps) => void;
  updateLoginInfo: (info: InfoProps) => void;
  setUser: Dispatch<SetStateAction<null>>;
  registerUser: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  registerError: string;
  isRegisterLoading: boolean;
  logoutUser: () => void;
  loginUser: (e: FormEvent<HTMLFormElement>) => void
  isLoginLoading: boolean
  loginError: string
}

export const AuthContext = createContext<Props>({
  registerInfo: { name: "", email: "", password: "" },
  updateRegisterInfo: () => null,
  updateLoginInfo: () => null,
  setUser: () => null,
  user: null,
  registerUser: () => null,
  registerError: "",
  isRegisterLoading: false,
  logoutUser: () => null,
  loginUser: () => null,
  isLoginLoading: false,
  loginError: "",
  loginInfo: {email: "", password: ""}
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("User");

    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const updateRegisterInfo = useCallback((info: InfoProps) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info: InfoProps) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegisterError("");

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo)
      );

      setIsRegisterLoading(false);
      if (response?.error) {
        return setRegisterError(response?.message);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [registerInfo]
  );

  const loginUser = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");

    const response = await postRequest(
      `${baseUrl}/users/login`,
      JSON.stringify(loginInfo)
    );

    setIsLoginLoading(false);
    if (response?.error) {
      return setLoginError(response?.message);
    }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);
  }, [loginInfo]);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  const value: Props = {
    user,
    registerInfo,
    updateRegisterInfo,
    setUser,
    registerUser,
    registerError,
    isRegisterLoading,
    logoutUser,
    loginUser, 
    isLoginLoading,
    loginError, 
    updateLoginInfo, 
    loginInfo
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
