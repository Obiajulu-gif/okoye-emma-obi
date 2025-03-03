"use client"

import { Code, Database, Server, Monitor } from "lucide-react"
import Image from "next/image"
import Illustrations from "./Illustrations";
export default function About() {
  const skills = [
    {
      icon: <Code className="w-8 h-8 text-blue-500" />,
      title: "Language",
      description: "Python, JavaScript, C, TypeScript",
    },
    {
      icon: <Monitor className="w-8 h-8 text-green-500" />,
      title: "Frontend",
      description: "Next.js, React, TailwindCSS",
    },
    {
      icon: <Server className="w-8 h-8 text-purple-500" />,
      title: "DevOps",
      description: "Redis, Linux, Node.js, Bash",
    },
    {
      icon: <Database className="w-8 h-8 text-yellow-500" />,
      title: "Backend",
      description: "Flask, REST APIs, SQL, MongoDB",
    },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden relative"
    >
      <Illustrations/>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold mb-8 text-center dark:text-white">
          About Me
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              I'm a versatile software developer with a passion for creating
              innovative solutions using Python, JavaScript, and C. My expertise
              ranges from web development to automation, data analysis, and
              more. I have a strong foundation in the MERN stack (MongoDB,
              Express.js, React.js, Node.js), and I enjoy solving complex
              problems and delivering optimized solutions.
            </p>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              My expertise extends to modern frameworks like Next.js and state
              management tools like Redux. I'm committed to writing clean,
              efficient code and staying up-to-date with the latest industry
              trends to deliver cutting-edge solutions for my clients.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                {skill.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2 dark:text-white">
                  {skill.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </section>
  );
}
