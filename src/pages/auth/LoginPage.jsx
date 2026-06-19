import { useState } from "react";
import { signIn } from "../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getCompany } from "../../services/companyService";
import PasswordInput from "../../services/PasswordInput";

export default function LoginPage() {

  // const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // // Already logged in
  // if (user) {
  //   return <Navigate to="/" replace />;
  // }

  async function handleLogin() {
    setError("");
    setLoading(true);

    const { data, error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    const { data: company } = await getCompany(data.user.id);

    if (company) {
      navigate("/", { replace: true });
    } else {
      navigate("/company-setup", { replace: true });
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Login to APL Services
        </p>

        <input
          type="email"
          placeholder="Email"
          className="input-field mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder="Password"
          className="mb-6"
        />
        <div className="text-right mb-5">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        {
          error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )
        }
        <button
          className="w-full bg-navy-900 text-white rounded-xl py-3 font-semibold"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create Account
          </Link>
        </div>

      </div>

    </div>

  );
}