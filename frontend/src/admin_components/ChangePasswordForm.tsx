import React, { useEffect, useState } from "react";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import { useAuth } from "../context/AuthContextType";
import LoadingWheel from "../components/LoadingWheel";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface ChangePasswordFormProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword1, setNewPassword1] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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
            navigate("/login");
            if (closePopupCallback) {
              closePopupCallback();
            }
          }}
        />
      </div>
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) {
      return;
    }
    setLoading(true);

    try {
      const response = await api.post("/auth/change-password", {
        oldPassword,
        newPassword: newPassword1,
      });

      if (openPopupCallback) {
        openPopupCallback(
          getPopupContent(
            "Your password has been successfully changed to a new one"
          ),
          "Success!"
        );
      }
      setOldPassword("");
      setNewPassword1("");
      setNewPassword2("");
    } catch (err) {
      // Handle errors
      setError("Failed to update password. Please check your old password.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      newPassword1.length &&
      newPassword2.length &&
      newPassword1 !== newPassword2
    ) {
      setError("New passwords do not match.");
    } else {
      setError(null);
    }
  }, [newPassword1, newPassword2, oldPassword]);

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="min-w-200px w-full max-w-500px mx-auto p-4 bg-card text-cardText rounded shadow relative"
      >
        <div className="w-full h-full flex gap-4 items-center">
          <div className="flex-1">
            <Input
              label="Old password"
              type="password"
              id="oldPassword"
              autocomplete="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              inputClassName="mobile:w-full"
            />
            <Input
              label="New password"
              type="password"
              id="newPassword1"
              value={newPassword1}
              autocomplete="new-password"
              placeholder="Enter the new password"
              onChange={(e) => setNewPassword1(e.target.value)}
              inputClassName="mobile:w-full"
            />
            <Input
              label="Repeat new password"
              type="password"
              id="newPassword2"
              value={newPassword2}
              autocomplete="new-password"
              placeholder="Enter the new password"
              onChange={(e) => setNewPassword2(e.target.value)}
              inputClassName="mobile:w-full"
            />
            {error && <p className="text-red-500 h-9 text-center">{error}</p>}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            text="Update password"
            type={"submit"}
            disabled={!user || loading}
            className="w-1/2 font-bold"
          />
        </div>
        {loading && (
          <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <LoadingWheel />
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePasswordForm;
