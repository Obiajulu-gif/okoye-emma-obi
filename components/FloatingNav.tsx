"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaArrowUp } from "react-icons/fa"

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "project", label: "Project" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
]

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.6,
    })

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.nav
      className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg p-2 flex flex-col gap-4">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() =>
              document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
            }
            className={`group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
              activeSection === id
                ? "bg-blue-600 dark:bg-blue-400 scale-110"
                : "bg-gray-300 dark:bg-gray-600 hover:scale-105"
            }`}
            aria-label={`Scroll to ${label}`}
          >
            <span className="absolute right-12 w-auto p-1 font-medium text-sm text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {label}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {activeSection !== "hero" && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() =>
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-4 flex items-center justify-center w-8 h-8 bg-blue-600 dark:bg-blue-400 text-white rounded-full shadow hover:scale-110 transition-transform"
            aria-label="Back to Top"
          >
            <FaArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}