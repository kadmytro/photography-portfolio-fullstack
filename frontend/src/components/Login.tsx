import React, { useState } from "react";
import { login } from "../services/loginApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import Input from "../base_components/Input";
import Button from "../base_components/Button";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      login(username, password);
      await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      const verifyTockenResponse = await api.get("/auth/verify-token", {
        withCredentials: true,
      });
      setUser(verifyTockenResponse.data.user);
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-fit bg-primary" style={{ height: "calc(100vh - 224px)" }}>
      <div className="w-full max-w-md p-8 bg-card text-cardText rounded shadow-md" >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <Input
            label="Username"
            placeholder="e.g. username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={true}
          />
          <Input
            label="Password"
            placeholder="your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <Button type="submit" text="Log in" className="font-bold w-full" />
        </form>
      </div>
    </div>
  );
};

export default Login;
