import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import styles from "./AuthCard.module.css";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async ({ email, password }: AuthFormData) => {
    setError("");

    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className={styles.title}>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={styles.input}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={styles.input}
          />
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
