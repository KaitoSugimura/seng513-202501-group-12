import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useMemo } from "react";
import { databases, dbId, User } from "../../util/appwrite";

export default function Account() {
  const location = useLocation();
  const viewUsername = location.state;
  const { user, loadingAuth, logout } = useAuth();
  const [viewUser, setViewUser] = useState<User | null>(null);
  const displayUser = viewUser || user;

  useEffect(() => {
    const getViewUserProfile = async () => {
      try {
        const response = await databases.listDocuments(dbId, "users", [Query.equal("username", [viewUsername])]);
        if (response.documents.length = 1) {
          setViewUser(response.documents[0] as User);
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

  const quizQuery = useMemo(() => {
    return [Query.contains("creatorUsername", [displayUser?.username || ""])];
  }, [displayUser?.username]);

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
          <h1 className={styles.header}>{displayUser?.username}'s Profile </h1>
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
              title="Created Quizzes"
              query={quizQuery}
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
