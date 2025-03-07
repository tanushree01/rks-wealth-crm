"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface FormData {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
              {["firstName", "lastName", "email", "phone", "address"].map(
                (field) => (
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
                )
              )}

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

              {[
                { name: "gender", options: ["Male", "Female", "Other"] },
                {
                  name: "maritalStatus",
                  options: ["Single", "Married", "Divorced", "Widowed"],
                },
                { name: "userType", options: ["Admin", "User", "Guest"] },
              ].map(({ name, options }) => (
                <div key={name}>
                  <Label
                    htmlFor={name}
                    className="text-[#1D3E6F] dark:text-[#74A82E]"
                  >
                    {formatLabel(name)}
                  </Label>
                  <select
                    id={name}
                    name={name as keyof FormData}
                    value={formData[name as keyof FormData]}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:border-[#1D3E6F] dark:focus:border-[#74A82E] focus:ring-[#1D3E6F] dark:focus:ring-[#74A82E]"
                  >
                    <option value="">Select {formatLabel(name)}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
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
