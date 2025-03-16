import { useState } from "react";
import Card from "../Card";
import styles from "./AuthCard.module.css";
import Login from "./Login";
import Register from "./Register";

const AuthCard = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <Card className={styles.card}>
      {isLogin ? <Login /> : <Register />}

      <p className={styles.toggle}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </Card>
  );
};

export default AuthCard;
