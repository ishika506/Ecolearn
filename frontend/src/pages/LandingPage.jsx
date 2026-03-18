import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-500 p-6 font-sans transition-all duration-500">
      
      {/* Main Card Container */}
      <div 
        className="
          w-full max-w-2xl 
          bg-[#d6f5d6] 
          rounded-[50px] 
          p-12 sm:p-20 
          text-center 
          transition-all duration-500 
          shadow-[20px_20px_60px_#b0d9b0,_-20px_-20px_60px_#ffffff]
        "
      >
        
        {/* Logo and Main Title */}
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="
            w-24 h-24 mb-6 
            rounded-full 
            bg-[#d6f5d6] 
            flex items-center justify-center
            shadow-[6px_6px_18px_#b0d9b0,_-6px_-6px_18px_#ffffff]
          ">
            <span className="text-5xl text-green-700">🌱</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
            Eco<span className="text-green-700">Learn</span>
          </h1>
        </div>

        {/* Professional Heading */}
        <h2 className="text-3xl font-bold text-green-800 mb-4 leading-snug">
          Begin Your Sustainable Journey
        </h2>

        {/* Subtext */}
        <p className="text-green-700 mb-12 text-lg font-normal max-w-sm mx-auto">
          Access high-quality environmental knowledge and resources tailored for action.
        </p>

        {/* Action Button (Styled to fit the Neumorphism aesthetic) */}
        <button
          onClick={() => navigate("/signin")}
          className="
            w-full sm:w-2/3 
            bg-[#5bab5b]
            text-white font-bold text-xl 
            px-10 py-5 rounded-full 
            shadow-[-6px_-6px_16px_rgba(255,255,255,0.9),6px_6px_16px_rgba(90,171,91,0.4)] 
            transition-all duration-300 
            hover:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
            active:shadow-[inset_5px_5px_10px_rgba(0,0,0,0.12),inset_-5px_-5px_10px_rgba(255,255,255,0.85)] 
            focus:outline-none focus:ring-4 focus:ring-green-700/30
          "
        >
          Get Started
        </button>
      </div>
    </div>
);
};

export default LandingPage;
