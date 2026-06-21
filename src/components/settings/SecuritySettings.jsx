import { useState } from "react";
import { changePassword } from "../../services/securityService";
import PasswordInput from "../../services/PasswordInput";
import { useAuth } from "../../auth/AuthContext";

export default function SecuritySettings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const { user } = useAuth();


  async function handleSubmit(e) {
    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    e.preventDefault();

    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await changePassword(
      user.email,
      currentPassword,
      newPassword
    )

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Password updated successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block mb-2 font-medium">
          Current Password
        </label>

        <PasswordInput
          value={currentPassword}
          onChange={setCurrentPassword}
        />
      </div>
      <div>
        <label className="block mb-2 font-medium">
          New Password
        </label>

        <PasswordInput
          value={newPassword}
          onChange={setNewPassword}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Confirm Password
        </label>

        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm">
          {success}
        </p>
      )}

      <button
        disabled={loading}
        className="w-full bg-navy-900 text-white py-3 rounded-xl font-semibold"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>

    </form>
  );
}