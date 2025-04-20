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
import { account, databases, dbId, User, Quiz } from "../util/appwrite";

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isAdminUser: boolean;
  loadingAuth: boolean;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavoriteQuiz: (quiz: Quiz) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
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

        if (user.labels.includes("admin")) {
          setIsAdminUser(true);
        } else {
          setIsAdminUser(false);
        }

        setUser(userData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingAuth(false);
      }
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

    const user = await account.get();
    if (user.labels.includes("admin")) {
      setIsAdminUser(true);
    } else {
      setIsAdminUser(false);
    }

    setUser(userData);
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    setIsAdminUser(false);
  };

  let updateQueue = Promise.resolve();
  const toggleFavoriteQuiz = (quiz: Quiz) => {
    updateQueue = updateQueue.then(async () => {
      try {
        if (!user) {
          return;
        }
        // get the latest data from the db, in case toggleFavoriteQuiz is called too fast before
        // the user usestate hook is updated
        const latestUser = await databases.getDocument(dbId, "users", user.$id);
        const isQuizFavorited = latestUser.favoritedQuizIds.includes(quiz.$id);

        const updatedFavoritedQuizIdsList = isQuizFavorited
          ? latestUser.favoritedQuizIds.filter((id: string) => id !== quiz.$id)
          : [...latestUser.favoritedQuizIds, quiz.$id];

        const updatedUserData: User = await databases.updateDocument(
          dbId,
          "users",
          user.$id,
          {
            favoritedQuizIds: updatedFavoritedQuizIdsList,
          }
        );
        setUser(updatedUserData);

        (async () => {
          const gotQuiz: Quiz = await databases.getDocument(
            dbId,
            "quizzes",
            quiz.$id
          );
          await databases.updateDocument(dbId, "quizzes", quiz.$id, {
            favoritedCount: gotQuiz.favoritedCount + (isQuizFavorited ? -1 : 1),
          });
        })();
      } catch (err) {
        console.error("Failed to update favorite quiz: ", err);
      }
    });
    return updateQueue;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAdminUser,
        loadingAuth,
        register,
        login,
        logout,
        toggleFavoriteQuiz,
      }}
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
