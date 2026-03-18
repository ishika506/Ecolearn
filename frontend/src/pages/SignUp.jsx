import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

// --- Neumorphism Helper Classes ---

// Main Background/Shell (Green Gradient)
const pageShellClasses = "flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-500 p-6 font-sans transition-all duration-500";
 
// Card Container (Raised)
const neoCardClasses = "w-full max-w-md bg-[#d6f5d6] rounded-[40px] p-8 sm:p-12 text-center transition-all duration-500 shadow-[20px_20px_60px_#b0d9b0,_-20px_-20px_60px_#ffffff]";
 
// Input Field (Sunken)
const neoInputClasses = "w-full p-4 rounded-xl bg-[#e6fae6] text-gray-800 placeholder-green-400 border-none transition-all duration-300 shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-700/30";

// Button (Raised/Pressable Green)
const neoButtonClasses = (isLoading) => `
    w-full 
    bg-[#5bab5b]
    text-white font-bold text-xl 
    px-10 py-4 rounded-full 
    shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),6px_6px_16px_rgba(90,171,91,0.4)] 
    transition-all duration-300 
    hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
    active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
    focus:outline-none focus:ring-4 focus:ring-green-700/30
    ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}
`;

const SignUp = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Track loading state
    const navigate = useNavigate();

    const { dispatch } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        dispatch({ type: "LOGIN_START" }); // Update global loading state

        try {
            // 1. Registration
            const registerRes = await axios.post("http://localhost:8800/api/auth/register", formData);
            
            // 2. Auto-login after successful registration
            const loginRes = await axios.post("http://localhost:8800/api/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            // 3. Success and Redirect
            const user = loginRes.data.user;
            const token = loginRes.data.token;

            dispatch({ 
                type: "LOGIN_SUCCESS", 
                payload: { ...user, token: token }
            });

            localStorage.setItem("token", token);
            
            // Determine redirect path (e.g., if user role is defined)
            const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/home';
            navigate(redirectPath);

        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong during registration.";
            dispatch({ type: "LOGIN_FAILURE", payload: msg });
            setError(msg);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className={pageShellClasses}>
            <div className={neoCardClasses}>
                
                {/* Logo and Title */}
                <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 mr-3 rounded-full bg-[#d6f5d6] flex items-center justify-center shadow-[6px_6px_18px_#b0d9b0,_-6px_-6px_18px_#ffffff]">
                        <span className="text-2xl text-green-700">🌱</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Eco<span className="text-green-700">Learn</span>
                    </h1>
                </div>

                {/* Heading and Subtext */}
                <h2 className="text-2xl font-semibold text-green-800 text-center mb-2">Create your account</h2>
                <p className="text-green-700 text-center mb-8 text-base font-normal max-w-xs mx-auto">
                    Join EcoLearn to start learning, doing, and earning eco-points.
                </p>

                {/* Form */}
                <form className="space-y-5 text-left" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2 ml-4">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={neoInputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2 ml-4">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className={neoInputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-green-700 mb-2 ml-4">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className={neoInputClasses}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={neoButtonClasses(loading)} // Apply loading state class
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                {/* Error Message */}
                {error && <p className="text-red-600 mt-4 text-sm text-center font-medium">{error}</p>}

                {/* Navigation to Login */}
                <div className="mt-8 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/signin" className="text-green-700 font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;