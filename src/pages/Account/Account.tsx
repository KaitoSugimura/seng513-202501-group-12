import AuthCard from "../../components/Auth/AuthCard";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import styles from "./Account.module.css";

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
      <h1 className={styles.title}>Account</h1>

      {user && (
        <>
          <p className={styles.subtitle}>Welcome back, {user.username}!</p>
          <Button className={styles.button} onClick={() => logout()}>
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
