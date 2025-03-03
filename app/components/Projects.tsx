"use client";
import Image from "next/image";
import { CardWrapper } from "../../components/ui/CardWrapper";
import { ExternalLink } from "lucide-react";
import Illustrations from "./Illustrations";

interface ProjectProps {
    title: string;
    description: string;
    image: string;
    demoLink: string;
    githubLink: string;
}

function ProjectCard({
    title,
    description,
    image,
    demoLink,
    githubLink,
}: ProjectProps) {
    return (
			<CardWrapper className="overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white  hover:from-blue-700 hover:to-purple-700">
				<div className="relative h-48 mb-4">
					<Image
						src={image || "/placeholder.svg"}
						alt={title}
						fill
						className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
					/>
				</div>
				<h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2">
					{title}
				</h3>
				<p className="text-gray-300 text-sm mb-4">{description}</p>
				<div className="flex gap-4">
					<a
						href={demoLink}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 px-4 py-2 border border-white text-primary rounded hover:bg-primary hover:text-white transition-colors"
					>
						<ExternalLink size={16} /> Demo
					</a>
					<a
						href={githubLink}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
					>
						Code
					</a>
				</div>
			</CardWrapper>
		);
}

export default function Projects() {
    const projects = [
        {
            title: "NFT Marketplace Dashboard",
            description:
                "A modern dashboard for NFT trading with real-time updates and analytics.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
        {
            title: "E-commerce Platform",
            description:
                "Full-featured e-commerce solution with cart, checkout, and payment integration.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
        {
            title: "Social Media App",
            description:
                "Real-time social media platform with messaging and post sharing features.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
        {
            title: "Task Management Tool",
            description:
                "Collaborative task management app with drag-and-drop interface.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
        {
            title: "Weather Dashboard",
            description:
                "Weather forecasting app with interactive maps and real-time updates.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
        {
            title: "Fitness Tracking App",
            description:
                "Personal fitness tracker with workout plans and progress monitoring.",
            image: "/placeholder.svg?height=300&width=400",
            demoLink: "#",
            githubLink: "#",
        },
    ];

    return (
			<section
				className="py-1 relative overflow-hidden bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors"
				id="project"
			>
				{/*  Illustrations */}
				<Illustrations />
				<div className="container mx-auto p-10  text-center ">
					<h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
					<p className="text-gray-400 max-w-2xl mx-auto">
						Explore my latest web development projects. Each project
						demonstrates my commitment to creating innovative and user-friendly
						digital solutions.
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