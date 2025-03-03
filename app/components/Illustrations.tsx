import React from 'react';

const Illustrations = () => {
    return (
        <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="skill-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
                        <path d="M50 30 L50 70 M30 50 L70 50" stroke="currentColor" strokeWidth="2" />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="100%" fill="url(#skill-pattern)" />
            </svg>
        </div>
    );
};

export default Illustrations;