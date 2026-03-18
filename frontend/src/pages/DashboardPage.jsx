import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-2">
      <div className="neo-card rounded-[36px] p-10 text-center">
        <p className="text-lg font-semibold text-green-700 mb-2">Welcome back</p>
        <h1 className="text-5xl font-extrabold text-green-900">
          👋 {user?.name || "Eco Hero"}
        </h1>
        <p className="text-green-700 mt-4 text-lg">
          “The future will be green, or not at all.” — Jonathan Porritt
        </p>
      </div>

      <div className="neo-card rounded-[32px] p-8 flex flex-col items-center text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7662/7662109.png"
          alt="Growing Plant"
          className="w-40 h-40 mb-6 drop-shadow-md"
        />
        <p className="text-green-800 font-semibold text-lg">
          💡 Eco Tip: Recycling one plastic bottle saves enough energy to light a bulb for 3 hours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {["Small acts, when multiplied by millions, can change the world.", "Nature is not a place to visit. It is home."].map((quote, idx) => (
          <div key={idx} className="neo-card rounded-[28px] p-6 text-center font-semibold text-green-900 italic">
            {quote}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[{ icon: "🌱", label: "Eco Level" }, { icon: "♻️", label: "Recycled" }, { icon: "🌍", label: "Impact Score" }].map((item, idx) => (
          <div key={idx} className="neo-card rounded-[24px] p-6 flex flex-col items-center justify-center text-green-900">
            <span className="text-4xl mb-2">{item.icon}</span>
            <p className="font-bold">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
