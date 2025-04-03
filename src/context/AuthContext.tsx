import { ID } from "appwrite";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { account, databases, dbId, User } from "../util/appwrite";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  loadingAuth: boolean;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        const userData: User = await databases.getDocument(
          dbId,
          "users",
          user.$id
        );

        setUser(userData);
      } catch (error) {
        console.log(error);
      }
      setLoadingAuth(false);
    };

    fetchUser();
  }, []);

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    const user = await account.create(ID.unique(), email, password);
    await account.createEmailPasswordSession(email, password);

    const userData: User = await databases.createDocument(
      dbId,
      "users",
      user.$id,
      {
        username,
        points: 0,
      }
    );

    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const session = await account.createEmailPasswordSession(email, password);
    const userData: User = await databases.getDocument(
      dbId,
      "users",
      session.userId
    );

    setUser(userData);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loadingAuth, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};
