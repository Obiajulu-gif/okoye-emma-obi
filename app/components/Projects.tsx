"use client";
import Image from "next/image";
import { CardWrapper } from "../../components/ui/CardWrapper";
import { ExternalLink, Github } from "lucide-react";
import Illustrations from "./Illustrations";
import projects from "./project";
import { motion } from "framer-motion";

interface ProjectProps {
	title: string;
	description: string;
	image: string;
	demoLink: string;
	githubLink: string;
}

const cardVariants = {
	hidden: { opacity: 0, y: 50 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ProjectCard({
	title,
	description,
	image,
	demoLink,
	githubLink,
}: ProjectProps) {
	return (
		<motion.div
			variants={cardVariants}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.2 }}
			className="h-full"
		>
			<CardWrapper className="h-full flex flex-col overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg rounded-lg">
				<div className="relative h-48">
					<Image
						src={image || "/placeholder.svg"}
						alt={title}
						fill
						className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
					/>
				</div>
				{/* Wrap text and actions in a flex container */}
				<div className="flex flex-col flex-1 p-4">
					<div className="mb-4">
						<h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
							{title}
						</h3>
						<p className="text-gray-300 text-sm">{description}</p>
					</div>
					<div className="mt-auto flex gap-4">
						<a
							href={demoLink}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 border border-transparent text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
						>
							<ExternalLink size={16} /> Demo
						</a>
						<a
							href={githubLink}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 border border-transparent text-white rounded-lg shadow-md hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
						>
							<Github size={16} /> Code
						</a>
					</div>
				</div>
			</CardWrapper>
		</motion.div>
	);
}

export default function Projects() {
	return (
		<section
			className="py-10 relative overflow-hidden bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors"
			id="project"
		>
			{/* Illustrations */}
			<Illustrations />
			<div className="container mx-auto p-10 text-center">
				<h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
				<p className="text-gray-400 max-w-2xl mx-auto">
					Explore my latest web development projects. Each project demonstrates
					my commitment to creating innovative and user-friendly digital solutions.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
				{projects.map((project, index) => (
					<ProjectCard key={index} {...project} />
				))}
			</div>
		</section>
	);
}