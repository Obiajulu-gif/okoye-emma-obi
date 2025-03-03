"use client"

import { useEffect, useRef, useState } from "react";
import { Code, Database, Server, Monitor } from "lucide-react";
import Illustrations from "./Illustrations";

// This component types out an array of paragraphs sequentially.
function TypewriterSequence({
  paragraphs,
  delay = 50,
}: {
  paragraphs: string[];
  delay?: number;
}) {
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [completedParagraphs, setCompletedParagraphs] = useState<string[]>([]);

  useEffect(() => {
    if (currentParagraphIndex >= paragraphs.length) return;
    const currentText = paragraphs[currentParagraphIndex];
    let charIndex = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + currentText[charIndex]);
      charIndex++;
      if (charIndex >= currentText.length) {
        clearInterval(timer);
        // Save the fully typed paragraph.
        setCompletedParagraphs((prev) => [...prev, currentText]);
        // Small delay before starting the next paragraph.
        setTimeout(() => {
          setCurrentParagraphIndex((prev) => prev + 1);
          setDisplayed("");
        }, 500);
      }
    }, delay);

    return () => clearInterval(timer);
  }, [currentParagraphIndex, paragraphs, delay]);

  return (
    <div className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
      {completedParagraphs.map((para, index) => (
        <p key={index} className="mb-6">
          {para}
        </p>
      ))}
      {currentParagraphIndex < paragraphs.length && (
        <p className="mb-6">
          {displayed}
          <span className="animate-pulse">|</span>
        </p>
      )}
    </div>
  );
}

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

  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const paragraph1 =
    " I am a versatile software developer with a passion for creating innovative solutions using Python, JavaScript, and C. My expertise ranges from web development to automation, data analysis, and more. I have a strong foundation in the MERN stack (MongoDB, Express.js, React.js, Node.js), and I enjoy solving complex problems and delivering optimized solutions.";
  const paragraph2 =
    " My expertise extends to modern frameworks like Next.js and state management tools like Redux. I'm committed to writing clean, efficient code and staying up-to-date with the latest industry trends to deliver cutting-edge solutions for my clients.";

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden relative"
    >
      <Illustrations />
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold mb-8 text-center dark:text-white">
          About Me
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            {/* Trigger typewriter effect when section comes into view */}
            {inView && (
              <TypewriterSequence
                paragraphs={[paragraph1, paragraph2]}
                delay={50}
              />
            )}
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