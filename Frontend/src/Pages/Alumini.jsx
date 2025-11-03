import React, { useState } from "react";

import { Alumini2024, Alumini2023, Alumini2022 } from "../Constants/team";
import { FaLinkedin, FaInstagram, FaEnvelope, FaPhone } from "react-icons/fa";
import ProfileCard from "../Components/ProfileCard";

const Alumini = () => {
  const [activeYear, setActiveYear] = useState("2024");

  const alumniData = {
    2024: Alumini2024,
    2023: Alumini2023,
    2022: Alumini2022,
  };

  return (
    <div className="w-full min-h-screen blood-donors-background bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold text-center mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">
          Alumni Gallery
        </h1>

        {/* Year Selection Buttons */}
        <div className="flex justify-center mb-12 space-x-4">
          <div className="absolute top-[10%]  left-[5%] w-40 h-40 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
          <button
            onClick={() => setActiveYear("2022")}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${
              activeYear === "2022"
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            2022
          </button>
          <button
            onClick={() => setActiveYear("2023")}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${
              activeYear === "2023"
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            2023
          </button>
          <button
            onClick={() => setActiveYear("2024")}
            className={`px-6 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${
              activeYear === "2024"
                ? "bg-white text-black"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            2024
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
          {alumniData[activeYear].map((member, index) => (
            <ProfileCard
              title={member.role}
              handle={member.name}
              contactText="Contact Me"
              avatarUrl={member.image}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => console.log("Contact clicked")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alumini;
