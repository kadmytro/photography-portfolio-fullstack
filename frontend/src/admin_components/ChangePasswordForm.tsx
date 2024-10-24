import React, { useEffect, useState } from "react";
import Input from "../base_components/Input";
import Button from "../base_components/Button";
import { useAuth } from "../context/AuthContextType";
import LoadingWheel from "../components/LoadingWheel";
import axios from "axios";
import api from "../services/api";

const ChangePasswordForm: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword1, setNewPassword1] = useState<string>("");
  const [newPassword2, setNewPassword2] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Use this to get the logged-in user

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

      alert("Password updated successfully!");
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
  }, [newPassword1, newPassword2]);

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="min-w-500px max-w-500px mx-auto p-4 bg-card text-cardText rounded shadow relative"
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
            />
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
