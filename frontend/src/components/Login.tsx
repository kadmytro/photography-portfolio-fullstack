import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContextType";
import api from "../services/api";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import LoadingWheel from "./LoadingWheel";

type LoginType = "normal" | "forgot-password" | "reset-password" | undefined;

interface LoginProps {
  openPopupCallback?: (content: React.ReactNode) => void;
  closePopupCallback?: () => void;
}

const Login: React.FC<LoginProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState<LoginType>(undefined);
  const { resetToken } = useParams();
  const [newPassword1, setNewPassword1] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
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

  useEffect(() => {
    const path = location.pathname.split("/").filter((s) => s !== "");
    switch (path[0]) {
      case "forgot-password":
        setLoginType("forgot-password");
        setLoading(false);
        break;
      case "reset-password":
        setLoginType("reset-password");
        verifyToken(resetToken);
        break;
      case "login":
      default:
        setLoginType("normal");
        setLoading(false);
        break;
    }
  }, [location]);

  const verifyToken = async (resetToken: string | undefined) => {
    if (!resetToken) {
      setIsTokenValid(false);
      return;
    }

    try {
      const response = await api.post("/auth/verify-token", {
        token: resetToken,
      });

      setIsTokenValid(response.status == 200);
    } catch (err) {
      setIsTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  const getPopupContent = (message: string): React.ReactNode => {
    return (
      <div className="px-4 pb-4 pt-10 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <div className="svg-mask success-icon h-20 w-20 bg-green-500 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2"></div>
        <p>{message}</p>
        <Button
          buttonType="default"
          text="Ok"
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-1/2"
          onClick={() => {
            window.history.replaceState(null, "", "/login");
            setLoginType("normal");

            if (closePopupCallback) {
              closePopupCallback();
            }

            setEmail("");
            setError("");
            setPassword("");
          }}
        />
      </div>
    );
  };

  const submitForgotPasswordForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Check your email for the futher instructions.")
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitResetPasswordForm = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (error) {
      return;
    }
    setLoading(true);

    try {
      const response = await api.post("/auth/reset-password", {
        newPassword: newPassword1,
        token: resetToken,
      });

      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent("Password has been successfully changed!")
        );
      }
      setNewPassword1("");
      setNewPassword2("");
    } catch (err) {
      setError("Failed to update password. Please check your old password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      loginType === "reset-password" &&
      newPassword1.length &&
      newPassword2.length &&
      newPassword1 !== newPassword2
    ) {
      setError("New passwords do not match.");
    } else {
      setError("");
    }
  }, [newPassword1, newPassword2]);

  return (
    <div
      className="flex items-center justify-center min-h-fit bg-primary"
      style={{ height: "calc(100vh - 224px)" }}
    >
      <div className="w-full max-w-md p-8 bg-card text-cardText rounded shadow-md relative">
        {loading && (
          <div className="absolute z-20 inset-0 backdrop-blur-sm flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
        <div className="inline-flex mb-6 items-center w-full">
          {loginType === "forgot-password" && (
            <div
              data-tooltip="Back"
              onClick={() => {
                window.history.replaceState(null, "", "/login");
                setLoginType("normal");
              }}
              className="w-fit"
            >
              <div className="cursor-pointer svg-mask w-6 h-6 bg-cardText transition-all arrow-back-icon" />
            </div>
          )}
          <h2 className="flex-1 text-2xl font-bold text-center font-title">
            {loginType === "forgot-password"
              ? "Recover password"
              : loginType === "reset-password"
              ? "Reset password"
              : "Login"}
          </h2>
          {loginType === "forgot-password" && <div className="w-6" />}
        </div>
        {loginType === "normal" && (
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
            <div
              className="cursor-pointer text-cardText text-opacity-70 hover:text-opacity-100 my-2"
              onClick={() => {
                window.history.replaceState(null, "", "/forgot-password");
                setLoginType("forgot-password");
              }}
            >
              Forgot pasword?
            </div>
            <Button type="submit" text="Log in" className="font-bold w-full" />
          </form>
        )}
        {loginType === "forgot-password" && (
          <form onSubmit={submitForgotPasswordForm}>
            <Input
              label="Email"
              type="email"
              autocomplete="email"
              name="email"
              placeholder="e.g. my@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={true}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              type="submit"
              text="Reset password"
              className="font-bold w-full"
            />
          </form>
        )}
        {loginType === "reset-password" && isTokenValid && (
          <form
            onSubmit={submitResetPasswordForm}
            className="w-full text-cardText relative"
          >
            <div className="w-full h-full flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  label="New password"
                  type="password"
                  id="newPassword1"
                  value={newPassword1}
                  autocomplete="new-password"
                  placeholder="Enter the new password"
                  onChange={(e) => setNewPassword1(e.target.value)}
                />
                <Input
                  label="Repeat new password"
                  type="password"
                  id="newPassword2"
                  value={newPassword2}
                  autocomplete="new-password"
                  placeholder="Enter the new password"
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
                {error && (
                  <p className="text-red-500 h-9 text-center">{error}</p>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center">
              <Button
                text="Reset password"
                type={"submit"}
                disabled={loading}
                className="w-full font-bold"
              />
            </div>
          </form>
        )}
        {loginType === "reset-password" && !isTokenValid && (
          <div className="h-56 px-4 pb-4 pt-10 min-h-200px min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
            <div className="svg-mask error-icon h-20 w-20 bg-red-500 bg-opacity-70 mx-auto absolute top-3 left-1/2 -translate-x-1/2"></div>
            <p className="text-lg">The link has expired!</p>
            <Button
              buttonType="default"
              text="Go to login page"
              className="absolute left-1/2 -translate-x-1/2 bottom-2 w-1/2"
              onClick={() => {
                navigate("/login");
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
