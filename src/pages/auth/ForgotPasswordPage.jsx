import { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ForgotPasswordPage() {

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await resetPassword(email);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Password reset link has been sent to your email."
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Enter your email to receive a reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            className="input-field w-full mb-5"
            placeholder="Email Address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          {error &&
            <p className="text-red-500 mb-3">
              {error}
            </p>
          }

          {message &&
            <p className="text-green-600 mb-3">
              {message}
            </p>
          }

          <button
            className="w-full bg-navy-900 text-white py-3 rounded-xl font-semibold"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="text-center mt-6">

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}