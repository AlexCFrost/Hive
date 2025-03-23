"use client";
import { TypewriterEffect } from "../components/ui/typewriter-effect";

export function Typewriter() {
  const words = [
    {
      text: "Start",
    },
    {
      text: "building",
    },
    {
      text: "your",
    },
    {
      text: "community",
    },
    {
      text: "with",
    },
    {
      text: "Hive.",
      className: "text-yellow-500 dark:text-yellow-500",
    },
  ];
  return (
    <div className="bg-black flex flex-col items-center justify-center h-[40rem] ">
      <p className="text-white dark:text-neutral-200 text-base  mb-10">
        The communication starts from here
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white  text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}
