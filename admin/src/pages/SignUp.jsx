import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import API from "../api";

const SignUp = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [validationErrors, setValidationErrors] = useState({}); // State for frontend validation errors
    const [error, setError] = useState(null); // State for API errors
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    // --- Validation Logic ---

    // Password Regex: Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{8,}$/;
    // Email Regex: Must end with @gmail.com
    const emailRegex = /^[^\s@]+@gmail\.com$/; 

    /**
     * Runs validation on a single field and updates the validationErrors state.
     * @returns {boolean} True if all current errors are resolved, false otherwise.
     */
    const validateField = (name, value) => {
        let errors = { ...validationErrors };
        let isValid = true;
        
        // 1. Password Validation
        if (name === "password") {
            if (!passwordRegex.test(value)) {
                errors.password = "Password must be 8+ chars, contain 1 upper, 1 lower, 1 number, and 1 special char.";
                isValid = false;
            } else {
                delete errors.password;
            }
        }

        // 2. Email Validation
        if (name === "email") {
            if (!emailRegex.test(value)) {
                errors.email = "Email must be a valid address ending strictly with @gmail.com.";
                isValid = false;
            } else {
                delete errors.email;
            }
        }
        
        // 3. General Required Check
        if (value.trim() === "") {
            errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
            isValid = false;
        } else if (errors[name] && isValid) {
            // Clear general required error if specific validation (like regex) passes
            delete errors[name];
        }

        setValidationErrors(errors);
        
        // Check if the final list of errors is empty
        const allFieldsChecked = Object.keys(formData).every(key => formData[key].trim() !== "");
        return allFieldsChecked && Object.keys(errors).length === 0;
    };
    
    /**
     * Checks if the entire form is valid based on state.
     */
    const isFormValid = () => {
        const fieldsValid = Object.values(formData).every(value => value.trim() !== "");
        const noValidationErrors = Object.keys(validationErrors).length === 0;
        
        // Ensure that if values exist, they pass the core regexes
        const passwordPasses = formData.password ? passwordRegex.test(formData.password) : false;
        const emailPasses = formData.email ? emailRegex.test(formData.email) : false;

        return fieldsValid && noValidationErrors && passwordPasses && emailPasses;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Validate on change for immediate feedback
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final check before submission
        if (!isFormValid()) {
            setError("Please correct the errors in the form before submitting.");
            // Force validation display on all fields
            Object.keys(formData).forEach(key => validateField(key, formData[key]));
            return;
        }
        
        setLoading(true);
        dispatch({ type: "LOGIN_START" });
        setError(null);

        try {
            // 1. Admin registration (Hardcoded role "admin")
            await API.post("/auth/register", { ...formData, role: "admin" });

            // 2. Auto-login after registration
            const loginRes = await API.post("/auth/login", {
                email: formData.email,
                password: formData.password,
            });

            if (loginRes.data.user.role !== "admin") {
                const accessDeniedMsg = "Registration successful, but access denied: Only admins can log in here.";
                setError(accessDeniedMsg);
                dispatch({ type: "LOGIN_FAILURE", payload: "Not an admin" });
                return;
            }

            // 3. Success and Redirect
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: { ...loginRes.data.user, token: loginRes.data.token },
            });

            localStorage.setItem("token", loginRes.data.token);
            navigate("/admin/dashboard");

        } catch (err) {
            const msg = err.response?.data?.message || "Something went wrong during registration.";
            setError(msg);
            dispatch({ type: "LOGIN_FAILURE", payload: msg });
        } finally {
            setLoading(false);
        }
    };

    // --- Neumorphism Helper Classes (Unchanged) ---
    const pageShellClasses = "flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-500 p-6 font-sans transition-all duration-500";
    const neoCardClasses = "w-full max-w-md bg-[#d6f5d6] rounded-[40px] p-8 sm:p-12 text-center transition-all duration-500 shadow-[20px_20px_60px_#b0d9b0,_-20px_-20px_60px_#ffffff]";
    const neoInputClasses = "w-full p-4 rounded-xl bg-[#e6fae6] text-gray-800 placeholder-green-400 border-none transition-all duration-300 shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff] focus:outline-none focus:ring-4 focus:ring-green-700/30";
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
        ${loading || !isFormValid() ? 'opacity-60 cursor-not-allowed' : ''}
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
                    Admin Registration
                </h2>
                <p className="text-green-700 text-center mb-10 text-lg font-normal max-w-xs mx-auto">
                    Create an admin account to manage the platform.
                </p>

                {/* Form */}
                <form className="space-y-6 text-left" onSubmit={handleSubmit}>
                    
                    {/* Full Name Input */}
                    <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2 ml-4">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={`${neoInputClasses} ${validationErrors.name ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                         {validationErrors.name && validationErrors.name.includes('required') && (
                            <p className="text-red-500 text-xs mt-1 ml-4 font-medium">
                                ❌ {validationErrors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2 ml-4">Email Address (Must be @gmail.com)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@gmail.com"
                            className={`${neoInputClasses} ${validationErrors.email ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-4 font-medium">
                                ❌ {validationErrors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-semibold text-green-800 mb-2 ml-4">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className={`${neoInputClasses} ${validationErrors.password ? 'border-2 border-red-500' : ''}`}
                            required
                        />
                        {validationErrors.password && validationErrors.password.includes('Min 8 characters') && (
                            <p className="text-red-500 text-xs mt-1 ml-4 font-medium">
                                ❌ {validationErrors.password}
                            </p>
                        )}
                        {/* Detailed Password Requirements Display */}
                        <div className="mt-2 ml-4 text-xs space-y-0.5">
                            <p className={passwordRegex.test(formData.password) ? "text-green-600" : "text-gray-500"}>
                                {passwordRegex.test(formData.password) ? '✅' : '•'} Min 8 characters, 1 upper, 1 lower, 1 number, 1 special char.
                            </p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={neoButtonClasses}
                        disabled={loading || !isFormValid()}
                    >
                        {loading ? 'Registering...' : 'Register Admin'}
                    </button>
                </form>

                {/* API Error Message */}
                {error && <p className="text-red-600 mt-6 text-sm text-center font-medium">{error}</p>}
                
                {/* Navigation to Login/Home */}
                <div className="mt-8 text-center">
                    <p className="text-green-800 text-base">
                        Already registered?{" "}
                        <button
                            onClick={() => navigate("/signin")}
                            className="text-green-700 font-bold hover:underline ml-1 focus:outline-none"
                            disabled={loading}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;