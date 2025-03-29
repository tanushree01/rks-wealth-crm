"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: string;
  address: string;
  maritalStatus: string;
  userType: string;
}

const formatLabel = (label: string) => {
  return label
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

export default function Register() {
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    address: "",
    maritalStatus: "",
    userType: "",
  });

  const [loading, setLoading] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/auth/register`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("data================", data);
      toast.success("Registration successful!");
      setFormData({
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        gender: "",
        address: "",
        maritalStatus: "",
        userType: "",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#EAF2F8] dark:bg-[#1D3E6F] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl"
      >
        <Card className="shadow-lg border border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold text-[#1D3E6F] dark:text-[#74A82E]">
              Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                "userName",
                "firstName",
                "lastName",
                "email",
                "phone",
                "address",
              ].map((field) => (
                <div key={field}>
                  <Label
                    htmlFor={field}
                    className="text-[#1D3E6F] dark:text-[#74A82E]"
                  >
                    {formatLabel(field)}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type={field === "email" ? "email" : "text"}
                    autoComplete={field}
                    placeholder={`Enter your ${formatLabel(field)}`}
                    value={formData[field as keyof FormData]}
                    onChange={handleChange}
                    required
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1D3E6F] dark:focus:border-[#74A82E] focus:ring-[#1D3E6F] dark:focus:ring-[#74A82E]"
                  />
                </div>
              ))}

              {["password", "confirmPassword"].map((field) => (
                <div key={field}>
                  <Label
                    htmlFor={field}
                    className="text-[#1D3E6F] dark:text-[#74A82E]"
                  >
                    {formatLabel(field)}
                  </Label>
                  <Input
                    id={field}
                    name={field}
                    type="password"
                    autoComplete={field}
                    placeholder={`Enter your ${formatLabel(field)}`}
                    value={formData[field as keyof FormData]}
                    onChange={handleChange}
                    required
                    className="border-gray-300 dark:border-gray-600 focus:border-[#1D3E6F] dark:focus:border-[#74A82E] focus:ring-[#1D3E6F] dark:focus:ring-[#74A82E]"
                  />
                </div>
              ))}

              <div className="md:col-span-2 flex justify-center">
                <Button
                  type="submit"
                  className="w-full max-w-sm bg-[#74A82E] hover:bg-[#5A8824] text-white font-semibold py-2 rounded-md transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Sign Up"}
                </Button>
              </div>
            </form>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
              Already have an account?
              <Link
                href="/login"
                className="text-[#1D3E6F] dark:text-[#74A82E] hover:underline ml-1"
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
