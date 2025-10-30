"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Title from "@/components/Title";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm shadow-lg border border-gray-200">
        <CardHeader className="text-center pb-2">
          <Title />

          <CardTitle className="text-xl font-semibold text-gray-900">
            Login to your account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and password to continue
          </p>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-5">
              {/* Email */}
              <div className="flex flex-col">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-1"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col relative">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-6 text-gray-400 hover:text-indigo-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-0">
          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
          <div className="text-center text-sm text-gray-600">
            New here?{" "}
            <Link
              href="/register"
              className="text-red-500 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
