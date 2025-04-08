import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { databases, dbId, User, Quiz } from "../../util/appwrite";
import { NavLink } from "react-router-dom";

export default function Account() {
  const location = useLocation();
  const viewUsername = location.state;
  const { user, loadingAuth, setUser, logout } = useAuth();
  const [viewUser, setViewUser] = useState<User | null>(null);
  const displayUser = viewUser || user;
  const [isFriend, setIsFriend] = useState(false);
  const [loadingUser, setLoadingUser] = useState(0);
  const [createdQuizzes, setcreatedQuizzes] = useState<Quiz[] | null>(null);
  
  useEffect(() => {
    const getViewUserProfile = async () => {
      try {
        const response = await databases.listDocuments(dbId, "users", [Query.equal("username", [viewUsername])]);
        if (response.documents.length = 1) {
          setViewUser(response.documents[0] as User);
        }
        else {
          setViewUser(null);
        }
      }
      catch (err) {
        console.error("Failed to fetch user information:", err);
      }
    };

    if (viewUsername) {
      getViewUserProfile();
    }
  }, [viewUsername]);

  useEffect(() => {
    setLoadingUser(1);
    const fetchCreatedQuizzes = async () => {
      try {
        const quizzes = await databases.listDocuments(dbId, "quizzes", [Query.contains("creatorUsername", [displayUser.username])]);
        setcreatedQuizzes(quizzes.documents as Quiz[]);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      }
      finally {
        setLoadingUser(0);
      }
    };

    if (user && displayUser) {
      setIsFriend(user.friendIds?.includes(displayUser.$id));
      fetchCreatedQuizzes();
    }
  }, [user, displayUser]);

  const addFriend = async(id: string) => {
    if(user) {
      try {
        const updatedFriendIds = user.friendIds
        updatedFriendIds.push(id);         
        const updatedUser : User = await databases.updateDocument(dbId, "users", user.$id, {friendIds: updatedFriendIds});
        setIsFriend(true);
        setUser(updatedUser)
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    }
  }

  const removeFriend = async(id: string) => {
    if (user) {
      try {
        const updatedFriendIds = user.friendIds?.filter(friendId => friendId !== id) || [];
        const updatedUser : User = await databases.updateDocument(dbId, "users", user.$id, { friendIds: updatedFriendIds });
        setIsFriend(false);
        setUser(updatedUser)
      } catch (err) {
        console.error("Failed to remove friend:", err);
      }
    }
  };

  if (loadingAuth) {
    return (
      <div className={styles.accountRoot}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.accountRoot}>
      {displayUser && (
        <>
          <div className={styles.header}>
            <h1>{displayUser?.username}'s Profile </h1>
            {user && displayUser.$id !== user.$id && (
              <div>
                {isFriend ? (
                  <Button onClick={() => removeFriend(displayUser.$id)}>
                    Unfriend
                  </Button>
                ) : (
                  <Button onClick={() => addFriend(displayUser.$id)}>
                    Add Friend
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Points progress */}
          <div className={styles.experienceContainer}>
            <h2>Experience</h2>
            <div className={styles.progressContainer}>
              <p>Level {Math.floor(displayUser.points / 100)} - {displayUser.points % 100}/100 Points</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${displayUser.points % 100}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.quizContainer}>
          {createdQuizzes?.length != 0 && createdQuizzes != null? (
            <QuizListViewer
              key={loadingUser}
              title="Created Quizzes"
              quizList={createdQuizzes}
              limitLessView={true}
            />
          ) : (
            <div>
              {user?.$id === displayUser.$id ? (
              <div>
                <h3 className={styles.emptyListMessage}>
                  You have no created quizzes.
                </h3>
                <NavLink to="/create">
                  <button className={styles.navigateElsewhereButton}>
                    Create your first quiz!
                  </button>
                </NavLink>
              </div>
              ) : (
                <h3 className={styles.emptyListMessage}>
                  This user has not created any quizzes.
                </h3>          
              )}
            </div>
          )}
          </div>

          {user && user.$id === displayUser.$id && (
          <div className={styles.userControls}>
            <Button className={styles.logoutButton} onClick={() => {setLoadingUser(0); logout}}>
              Sign Out
            </Button>
          </div>
          )}
        </>
      )}
      {!user && (
        <>
          <p className={styles.subtitle}>Sign in to access all features.</p>
          <AuthCard />
        </>
      )}
    </div>
  );
}
