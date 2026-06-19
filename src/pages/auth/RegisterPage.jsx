import { useState } from "react";
import { signUp } from "../../services/authService";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import PasswordInput from "../../services/PasswordInput";

export default function RegisterPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister() {

    setLoading(true);
    setError("");

    const { error } = await signUp(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Verification email sent! Please check your inbox."
    );

    setMessage(
      "Verification email sent! Please verify your email before logging in."
    );

    setEmail("");
    setPassword("");

    // navigate("/", { replace: true });
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Start using APL Services
        </p>

        <input
          type="email"
          className="input-field mb-4 w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Password"
          className="mb-6"
        />
        {
          error &&
          <p className="text-red-500">{error}</p>
        }

        {
          message &&
          <p className="text-green-600">{message}</p>
        }

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white rounded-xl py-3 font-semibold"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </div>

      </div>

    </div>

  );
}