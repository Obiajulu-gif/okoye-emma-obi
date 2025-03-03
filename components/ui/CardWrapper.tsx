import type React from "react";

interface CardWrapperProps {
	children: React.ReactNode;
	className?: string;
}

export function CardWrapper({ children, className = "" }: CardWrapperProps) {
	return (
		<div
			className={`bg-card rounded-lg p-6 border border-primary/20 ${className}`}
		>
			{children}
		</div>
	);
}
