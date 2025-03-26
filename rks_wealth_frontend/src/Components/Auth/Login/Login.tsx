"use client";

import { Button } from "@/Components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // Import icons
import { loginSuccess } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`/api/auth/login`, { email, password });
      localStorage.setItem("token", data.token);
      dispatch(loginSuccess(data));
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center mt-20 bg-white dark:bg-[#1D3E6F]">
      <Image
        src="/logo.jpg"
        alt="Company Logo"
        width={150}
        height={150}
        className="mb-4"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-[400px] shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-[#34466e] dark:text-[#74A82E]">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[#34466e] dark:text-[#74A82E] font-medium"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-600 focus:border-[#74A82E] focus:ring-[#74A82E] dark:focus:border-[#5A8824] dark:focus:ring-[#5A8824]"
                />
              </div>

              {/* Password Field with Eye Toggle */}
              <div className="space-y-2 relative">
                <Label
                  htmlFor="password"
                  className="text-[#34466e] dark:text-[#74A82E] font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="border-gray-300 dark:border-gray-600 focus:border-[#74A82E] focus:ring-[#74A82E] dark:focus:border-[#5A8824] dark:focus:ring-[#5A8824] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-gray-500 dark:text-gray-400 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full mt-2 bg-[#74A82E] hover:bg-[#5A8824] text-white font-semibold py-2 rounded-md transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
              <Link
                href="/forgot-password"
                className="text-[#34466e] dark:text-[#74A82E] hover:underline"
              >
                Forgot Password?
              </Link>
            </p>
          </CardContent>

          {/* Signup Link */}
          <CardFooter className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#34466e] dark:text-[#74A82E] hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
