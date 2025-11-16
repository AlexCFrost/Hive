/* eslint-disable react-refresh/only-export-components */ 
"use client";
import { TypewriterEffect } from "../components/ui/typewriter-effect";
import { HoverEffect } from "../components/ui/card-hover-effect";
import { ParticleNetwork } from "../components/ui/particle-network";
import { Link } from "react-router-dom";


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
      <p className="text-white dark:text-neutral-200 text-2xl font-medium mb-10">
        The communication starts from here
      </p>
      <TypewriterEffect words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
        <Link to="/login">
          <button className="w-40 h-10 rounded-xl bg-white border dark:border-white text-black text-sm cursor-pointer">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="w-40 h-10 rounded-xl bg-black text-white border border-white text-sm cursor-pointer">
            Join now
          </button>
        </Link>
      </div>
    </div>
  );
}

export function AllCards() {
  return (
    <div className="bg-black max-w-screen mx-auto px-10 flex flex-col items-center">
    <h1 className="text-white text-3xl font-bold text-center">
      <span className="text-yellow-500">Technology </span> Infrastructure
    </h1>
    <HoverEffect items={about} />
  </div>
  );
}
export const about = [
  {
    title: "Socket.io",
    description: "A library for real-time, bidirectional communication between web clients and servers.",
    link: "https://socket.io",
  },
  {
    title: "Google Auth",
    description: "Secure authentication using Google OAuth for seamless user sign-in.",
    link: "https://developers.google.com/identity",
  },
  {
    title: "Tailwind CSS",
    description: "A utility-first CSS framework for building modern web interfaces.",
    link: "https://tailwindcss.com",
  },
  {
    title: "React + TypeScript",
    description: "A powerful combination for building scalable and maintainable frontend applications.",
    link: "https://vite.dev/",
  },
  {
    title: "MongoDB",
    description: "A NoSQL database designed for scalability and flexibility in modern applications.",
    link: "https://www.mongodb.com",
  },
  {
    title: "Express.js",
    description: "A minimal and flexible Node.js web application framework for building APIs.",
    link: "https://expressjs.com",
  },
];


export function FeaturesSection() {
  return (
    <div className="bg-black relative z-20 py-10 max-w-screen mx-auto">
      {/* Interactive Particle Network */}
      <div className="px-8">
        <ParticleNetwork />
      </div>

      {/* Features Grid */}
      <div className="mt-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Create Communities</h3>
            <p className="text-neutral-400 text-sm">
              Build your own community space with custom settings and invite members to join your growing network.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Real-Time Chat</h3>
            <p className="text-neutral-400 text-sm">
              Engage in instant conversations with community members through our real-time messaging system.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Secure Access</h3>
            <p className="text-neutral-400 text-sm">
              Join communities securely with unique keys and enjoy safe, authenticated interactions.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Stay Updated</h3>
            <p className="text-neutral-400 text-sm">
              Get instant notifications about community updates, news, and important announcements.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Easy Management</h3>
            <p className="text-neutral-400 text-sm">
              Manage your communities with intuitive admin tools and member controls all in one place.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group p-6 rounded-lg border border-neutral-800 hover:border-yellow-500 transition-all duration-300">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">Lightning Fast</h3>
            <p className="text-neutral-400 text-sm">
              Experience blazing-fast performance with our optimized platform built on modern technology.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-neutral-800 pt-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Hive</h3>
              <p className="text-neutral-400 text-sm">
                Building communities, one connection at a time.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-neutral-400 hover:text-white text-sm">About</Link></li>
                <li><Link to="/login" className="text-neutral-400 hover:text-white text-sm">Login</Link></li>
                <li><Link to="/signup" className="text-neutral-400 hover:text-white text-sm">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Connect</h3>
              <p className="text-neutral-400 text-sm">
                Join our community and stay updated with the latest news.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 text-sm">
              © {new Date().getFullYear()} Hive. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};


