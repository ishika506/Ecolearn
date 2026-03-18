import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch, user, loading, error } = useContext(AuthContext);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  // Redirect away if already authenticated
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Only allow admins
      if (res.data.user.role !== "admin") {
        setLocalError("Access denied: Only admins can log in here");
        dispatch({ type: "LOGIN_FAILURE", payload: "Not an admin" });
        return;
      }

      const userData = { ...res.data.user, token: res.data.token };
      dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      localStorage.setItem("token", res.data.token);

      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setLocalError(msg);
      dispatch({ type: "LOGIN_FAILURE", payload: msg });
    }
  };

  // --- Neumorphism Helper Classes ---

  // Main Background/Shell: Matches LandingPage gradient
  const pageShellClasses = "flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-500 p-6 font-sans transition-all duration-500";
  
  // Card Container: Raised element styling
  const neoCardClasses = "w-full max-w-md bg-[#d6f5d6] rounded-[40px] p-8 sm:p-12 text-center transition-all duration-500 shadow-[20px_20px_60px_#b0d9b0,_-20px_-20px_60px_#ffffff]";
  
  // Input Field: Sunken/Pressed element styling
  const neoInputClasses = "w-full p-4 rounded-xl bg-[#e6fae6] text-gray-800 placeholder-green-400 border-none transition-all duration-300 shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-700/30";

  // Button: Raised and pressable element styling
  const neoButtonClasses = `
    w-full 
    bg-[#5bab5b]
    text-white font-bold text-xl 
    px-10 py-4 rounded-full 
    shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),6px_6px_16px_rgba(90,171,91,0.4)] 
    transition-all duration-300 
    hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
    active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
    focus:outline-none focus:ring-4 focus:ring-green-700/30
    ${loading ? 'opacity-60 cursor-not-allowed' : ''}
  `;

  // --- Component JSX ---

  return (
    <div className={pageShellClasses}>
      <div className={neoCardClasses}>
        
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 mr-4 rounded-full bg-[#d6f5d6] flex items-center justify-center shadow-[6px_6px_18px_#b0d9b0,_-6px_-6px_18px_#ffffff]">
            <span className="text-3xl text-green-700">🌱</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
            Eco<span className="text-green-700">Learn</span>
          </h1>
        </div>

        {/* Heading and Subtext */}
        <h2 className="text-3xl font-semibold text-green-800 text-center mb-3">
          Admin Panel Login
        </h2>
        <p className="text-green-700 text-center mb-10 text-lg font-normal max-w-xs mx-auto">
          Sign in with your admin account to manage the platform
        </p>

        {/* Form */}
        <form className="space-y-6 text-left" onSubmit={handleSubmit}>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2 ml-4">
              Email Address
            </label>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={neoInputClasses}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-semibold text-green-800 mb-2 ml-4">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={neoInputClasses}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={neoButtonClasses}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Error Message */}
        {(localError || error) && (
          <p className="mt-6 text-center text-sm text-red-600 font-medium">
            {localError || error}
          </p>
        )}
        
        {/* Navigation to Sign Up */}
        <div className="mt-8 text-center">
            <p className="text-green-800 text-base">
                Need an admin account?{" "}
                <Link
                    to="/signup" // Assuming /signup is the admin registration route
                    className="text-green-700 font-bold hover:underline ml-1 focus:outline-none"
                    disabled={loading}
                >
                    Register Here
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;