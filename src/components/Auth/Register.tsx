import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import Button from "../Button";
import styles from "./AuthCard.module.css";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [error, setError] = useState("");
  const { register: registerAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async ({ email, username, password }: AuthFormData) => {
    setError("");

    try {
      await registerAuth(email, username, password);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2 className={styles.title}>Register</h2>

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
            type="text"
            placeholder="Username"
            {...register("username")}
            className={styles.input}
          />
          {errors.username && (
            <p className={styles.error}>{errors.username.message}</p>
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

          {error && <p className={styles.error}>{error}</p>}
        </div>

        <Button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
