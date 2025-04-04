import { auth, provider, signInWithPopup } from "../firebase";
import { useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      console.log("User logged in:", result.user);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      {user ? (
        <h2>Welcome, {user.displayName}</h2>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default Login;
