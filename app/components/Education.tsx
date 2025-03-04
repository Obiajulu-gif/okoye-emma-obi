"use client";

import { GraduationCap, Calendar, Award } from "lucide-react";
import Image from "next/image";
import AnimatedSectionHeader from "./AnimatedSectionHeader";
import { motion } from "framer-motion";
import Illustrations from "./Illustrations";

export default function Education() {
	const education = [
		{
			degree: "Bachelor's Degree in Pure and Industrial Chemistry",
			institution: "University of Nigeria, Nsukka",
			period: "2019 – 2024",
			achievements: [
				"Graduated with honors",
				"Faculty Best Programmer of the Year, Faculty of Physical Science, University of Nigeria Nsukka (2024)",
			],
		},
		{
			degree: "ALX Software Engineering",
			institution: "ALX Africa",
			period: "2023 – 2024",
			achievements: [
				"Completed comprehensive software engineering training with hands-on experience in full-stack development",
			],
		},
		{
			degree: "Aspire Leadership",
			institution: "Harvard University",
			period: "04/2024 - 06/2024",
			achievements: [
				"Completed a leadership development program with Harvard University",
			],
		},
	];

	return (
		<section
			id="education"
			className="py-20 bg-gradient-to-tr from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900 transition-colors duration-300 overflow-hidden relative"
		>
			<Illustrations />
			<div className="container mx-auto px-6 relative z-10">
				<AnimatedSectionHeader title="Education" />
				<div className="max-w-4xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{education.map((edu, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 50 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}
							className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
						>
							<div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 dark:bg-blue-700 rounded-br-full z-0 opacity-50"></div>
							<div className="relative z-10">
								<h3 className="text-2xl font-semibold mb-2 dark:text-white flex items-center">
									<GraduationCap className="w-6 h-6 mr-2" />
									{edu.degree}
								</h3>
								<p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
									{edu.institution}
								</p>
								<p className="text-gray-600 dark:text-gray-300 mb-4 flex items-center">
									<Calendar className="w-4 h-4 mr-2" />
									{edu.period}
								</p>
								<h4 className="text-lg font-medium mb-2 dark:text-gray-200 flex items-center">
									<Award className="w-5 h-5 mr-2" />
									Key Achievements:
								</h4>
								<ul className="list-disc list-inside space-y-2">
									{edu.achievements.map((achievement, idx) => (
										<li key={idx} className="text-gray-700 dark:text-gray-300">
											{achievement}
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
