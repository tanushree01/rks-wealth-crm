import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
const Profile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Profile Section */}
        <div className="flex flex-col justify-center items-center flex-1 p-8">
          {user ? (
            <div className="text-center text-gray-800 dark:text-white w-full max-w-4xl">
              <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 text-4xl font-semibold text-white mx-auto mb-4">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <h1 className="text-3xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {user.userType}
              </p>
              <div className="mt-6 space-y-2 text-lg">
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
                <p>
                  <strong>Address:</strong> {user.address}
                </p>
                <p>
                  <strong>Gender:</strong> {user.gender}
                </p>
                <p>
                  <strong>Marital Status:</strong> {user.maritalStatus}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              No user data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
