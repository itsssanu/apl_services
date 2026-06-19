import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../services/authService";
import PasswordInput from "../../services/PasswordInput";

export default function ResetPasswordPage() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setMessage("");

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated successfully.");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Reset Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Create your new password.
        </p>

        <form onSubmit={handleSubmit}>

          <PasswordInput
            value={password}
            onChange={setPassword}
            placeholder="New Password"
            className="mb-5"
          />

          <PasswordInput
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirm Password"
            className="mb-5"
          />

          {error && (
            <p className="text-red-500 mb-4">
              {error}
            </p>
          )}

          {message && (
            <p className="text-green-600 mb-4">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy-900 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>

      </div>

    </div>
  );
}