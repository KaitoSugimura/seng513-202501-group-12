import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { databases, dbId, User } from "../../util/appwrite";

export default function Account() {
  const location = useLocation();
  const viewUsername = location.state;
  const { user, loadingAuth, logout } = useAuth();
  const [viewUser, setViewUser] = useState<User | null>(null);
  const displayUser = viewUser || user;
  const [isFriend, setIsFriend] = useState(false);
  const [loadingUser, setLoadingUser] = useState(0);
  

  useEffect(() => {
    const getViewUserProfile = async () => {
      setLoadingUser(1);
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
      finally {
        setLoadingUser(0);
      }
    };

    if (viewUsername) {
      getViewUserProfile();
    }
    console.log(displayUser)
  }, [viewUsername]);

  useEffect(() => {
    if (user && displayUser) {
      setIsFriend(user.friendIds?.includes(displayUser.$id));
    }
  }, [user, displayUser]);

  const addFriend = async(id: string) => {
    if(user) {
      try {
        const updatedFriendIds = user.friendIds
        updatedFriendIds.push(id);         
        await databases.updateDocument(dbId, "users", user.$id, {friendIds: updatedFriendIds});
        setIsFriend(true);
      } catch (err) {
        console.error("Failed to fetch friends:", err);
      }
    }
  }

  const removeFriend = async(id: string) => {
    if (user) {
      try {
        const updatedFriendIds = user.friendIds?.filter(friendId => friendId !== id) || [];
        await databases.updateDocument(dbId, "users", user.$id, { friendIds: updatedFriendIds });
        setIsFriend(false);
      } catch (err) {
        console.error("Failed to remove friend:", err);
      }
    }
  };

  if (loadingAuth || loadingUser) {
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
            <QuizListViewer
              key={loadingUser}
              title="Created Quizzes"
              query={[Query.contains("creatorUsername", [displayUser.username])]}
              limitLessView={true}
            />
          </div>

          {user && !viewUser && (
          <div className={styles.userControls}>
            <Button className={styles.logoutButton} onClick={logout}>
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
