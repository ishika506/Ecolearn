import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch, user, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect away if already authenticated (e.g., after refresh)
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", {
        email,
        password,
      });

      // Successful login
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...res.data.user,
          token: res.data.token,
        },
      });

      // Redirect to home/dashboard
      navigate("/home", { replace: true });
    } catch (err) {
      dispatch({
        type: "LOGIN_FAILURE",
        payload: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  // Assuming 'Link' is imported from react-router-dom or similar
// Assuming 'handleSubmit', 'email', 'setEmail', 'password', and 'setPassword' are defined

// Assuming 'Link', 'handleSubmit', 'email', 'setEmail', 'password', and 'setPassword' are defined

  return (
    <div className="page-shell font-sans">

      <div
        className="neo-card w-full max-w-md p-8 sm:p-12 text-center rounded-[40px]"
      >

        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 mr-3 rounded-full bg-[#d6f5d6] flex items-center justify-center shadow-[3px_3px_9px_#b0d9b0,_-3px_-3px_9px_#ffffff]">
            <span className="text-2xl text-green-700">🌱</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Eco<span className="text-green-700">Learn</span>
          </h1>
        </div>

        <h2 className="text-2xl font-semibold text-green-800 text-center mb-2">
          Welcome back
        </h2>
        <p className="text-green-700 text-center mb-8 text-base font-normal">
          Sign in to continue learning and earning points
        </p>

        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 ml-4">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neo-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-700 mb-2 ml-4">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input"
            />
          </div>

          <button
            type="submit"
            className="neo-btn w-full mt-4 font-bold text-lg"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600 font-medium">
            {error}
          </p>
        )}

        <div className="mt-8 text-center text-sm">
          <span className="text-green-700">Don’t have an account?</span>{" "}
          <Link
            to="/signup"
            className="text-green-700 font-bold hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
