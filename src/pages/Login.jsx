import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await api.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;
      localStorage.setItem("token", token);

      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Library Login</h1>

        <p className="login-subtitle">
          Sign in to your library account
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="login-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;