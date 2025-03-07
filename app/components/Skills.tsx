"use client"

import { motion } from "framer-motion"
import { Code, Database, Server, Layout, GitBranch, Terminal, Layers, Cpu, Globe, Workflow } from "lucide-react"
import AnimatedSectionHeader from "./AnimatedSectionHeader"
import Illustrations from "./Illustrations"
const SkillIcon = ({ icon: Icon, color }: { icon: any; color: string }) => (
  <div className={`p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg`}>
    <Icon className={`w-6 h-6 ${color}`} />
  </div>
)

const skills = [
  {
    icon: Code,
    name: "Frontend Development",
    tech: "JavaScript, TypeScript, React.js, Next.js",
    description:
      "Building responsive and interactive user interfaces leveraging React.js, Next.js, and robust JavaScript/TypeScript fundamentals.",
    color: "text-blue-500",
  },
  {
    icon: Server,
    name: "Backend Development",
    tech: "Node.js, Express.js, Flask",
    description:
      "Creating scalable and secure server-side applications using Node.js, Express.js, and Fastify with a clean architecture.",
    color: "text-green-500",
  },
  {
    icon: Database,
    name: "Database Management",
    tech: "MongoDB, Mongoose, SQL",
    description:
      "Designing and implementing efficient database solutions for both NoSQL (MongoDB/Mongoose) and SQL systems.",
    color: "text-purple-500",
  },
  {
    icon: Layout,
    name: "UI/UX Design",
    tech: "TailwindCSS, Material UI",
    description:
      "Crafting beautiful and intuitive user interfaces with modern design principles using TailwindCSS and Material UI.",
    color: "text-pink-500",
  },
  {
    icon: GitBranch,
    name: "Version Control",
    tech: "Git, GitHub",
    description:
      "Managing code versions efficiently with Git and collaborating effectively using GitHub.",
    color: "text-orange-500",
  },
  {
    icon: Terminal,
    name: "Programming Languages",
    tech: "TypeScript, JavaScript, Python, C, PHP",
    description:
      "Writing robust and type-safe code using modern programming languages to build scalable applications.",
    color: "text-yellow-500",
  },
  {
    icon: Layers,
    name: "State Management",
    tech: "Redux, Context API",
    description:
      "Managing complex application state with modern state management solutions like Redux and Context API.",
    color: "text-indigo-500",
  },
  {
    icon: Cpu,
    name: "API Development",
    tech: "REST, GraphQL",
    description:
      "Designing and implementing efficient APIs for seamless data communication using REST and GraphQL.",
    color: "text-red-500",
  },
  {
    icon: Globe,
    name: "Web Performance",
    tech: "Optimization, SEO",
    description:
      "Optimizing web applications for speed, accessibility, and search engine visibility through advanced techniques.",
    color: "text-teal-500",
  },
  {
    icon: Workflow,
    name: "Agile Methodologies",
    tech: "Scrum, Kanban",
    description:
      "Working efficiently in agile environments using Scrum and Kanban for continuous delivery and iterative improvement.",
    color: "text-cyan-500",
  },
];


export default function Skills() {
  return (
		<section id="skills" className="py-20 relative overflow-hidden">
			{/* Gradient Background */}
			<div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors "></div>

			{/* Skill Illustrations */}
			<Illustrations />

			<div className="container mx-auto px-6 relative z-10">
				<AnimatedSectionHeader title="Skills & Expertise" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{skills.map((skill, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
								<div className="flex items-center mb-4">
									<SkillIcon icon={skill.icon} color={skill.color} />
									<div className="ml-4">
										<h3 className="text-lg font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
											{skill.name}
										</h3>
										<p className="text-sm text-gray-600 dark:text-gray-400">
											{skill.tech}
										</p>
									</div>
								</div>
								<p className="text-gray-700 dark:text-gray-300 text-sm">
									{skill.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

