"use client";
import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { apiEndpoint } from "@/lib/api-config";

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(apiEndpoint("/bee/user/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Validate received data
      if (!data.token || !data.email || !data.username) {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      localStorage.setItem("username", data.username);

      navigate("/home");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = apiEndpoint("/bee/user/auth/google");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-black p-4 md:rounded-2xl md:p-8 dark:bg-zinc-900">
        <h2 className="text-xl font-bold text-white dark:text-neutral-200">
          Welcome Back
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white dark:text-neutral-300">
          Log in to your account to continue
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              placeholder="johndoe@example.com"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-900 text-white"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-900 text-white"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white disabled:opacity-70 cursor-pointer"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log in"} &rarr;
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <button
            className="bg-gray-900 text-white group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md px-4 font-medium dark:bg-zinc-800 cursor-pointer"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <IconBrandGoogle className="h-4 w-4 text-white" />
            <span className="text-white text-sm">
              Log in with Google
            </span>
          </button>

          <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-sm text-neutral-600 hover:underline dark:text-neutral-400"
            >
              Return to about
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};