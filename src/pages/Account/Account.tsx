import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";
import QuizListViewer from "../../components/QuizListViewer";
import { Query } from "appwrite";

export default function Account() {
  const { user, loadingAuth, logout } = useAuth();

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
      {user && (
        <>
          <h1 className={styles.header}>{user?.username}'s Profile </h1>
          {/* Points progress */}
          <div className={styles.experienceContainer}>
            <h2>Experience</h2>
            <div className={styles.progressContainer}>
              <p>Level {Math.floor(user.points / 100)} - {user.points % 100}/100 Points</p>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${user.points % 100}%` }}></div>
              </div>
            </div>
          </div>
          
          <div className={styles.quizContainer}>
            <QuizListViewer
              title="Created Quizzes"
              query={[Query.contains("creatorUsername", [user.username])]}
            />
          </div>

          
          <div className={styles.userControls}>
            <Button className={styles.logoutButton} onClick={logout}>
              Sign Out
            </Button>
          </div>
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
