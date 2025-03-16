import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../util/firebase";
import styles from "./Account.module.css";

export default function Account() {
  const { user } = useAuth();

  return (
    <div className={styles.accountRoot}>
      <h1 className={styles.title}>Account</h1>

      {user && (
        <>
          <p className={styles.subtitle}>Welcome back, {user.displayName}!</p>
          <Button className={styles.button} onClick={() => auth.signOut()}>
            Sign Out
          </Button>
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
