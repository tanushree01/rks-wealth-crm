"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Card className="w-[350px] shadow-lg border border-gray-200 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Enter your password" required />
                            </div>
                            <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">
                            <Button type="submit" className="w-full mt-2" disabled={loading}>
                                {loading ? "Signing in..." : "Login"}
                            </Button>
                            </Link>
                           
                        </form>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                            <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Forgot Password?
                            </Link>
                        </p>
                    </CardContent>
                    {/* <CardFooter className="text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter> */}
                </Card>
            </motion.div>
        </div>
    );
}
