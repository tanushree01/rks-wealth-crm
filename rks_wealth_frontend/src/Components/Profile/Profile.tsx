import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex h-screen w-screen bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Profile Section */}
        <div className="flex flex-col justify-center items-center flex-1 px-4">
          {user ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center text-white w-full max-w-2xl border border-white/20">
              {/* Profile Image */}
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white/30 text-4xl font-semibold mx-auto mb-6 shadow-md border-4 border-white/40">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>

              {/* User Details */}
              <h1 className="text-4xl font-bold tracking-wide">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-1 text-lg opacity-80">{user.userType}</p>

              {/* Additional Info */}
              <div className="mt-6 space-y-4 text-lg text-white/90">
                <p>
                  <strong className="font-semibold">Email:</strong> {user.email}
                </p>
                <p>
                  <strong className="font-semibold">Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong className="font-semibold">Address:</strong>{" "}
                  {user.address}
                </p>
                <p>
                  <strong className="font-semibold">Gender:</strong>{" "}
                  {user.gender}
                </p>
                <p>
                  <strong className="font-semibold">Marital Status:</strong>{" "}
                  {user.maritalStatus}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-white text-xl opacity-80">
              No user data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
