import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  strings: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  gradientClass?: string;
  className?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  strings,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseTime = 2000,
  gradientClass = "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient",
  className = ""
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const currentString = strings[currentIndex];

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % strings.length);
        // Small pause before typing next word
        timeout = setTimeout(() => {}, 200); 
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentString.substring(0, displayText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (displayText === currentString) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(currentString.substring(0, displayText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, strings, typingSpeed, deletingSpeed, pauseTime]);

  const longestString = strings.reduce((a, b) => a.length > b.length ? a : b, "");

  return (
    <span className={`inline-flex items-center relative ${className}`}>
      {/* Invisible placeholder for max width */}
      <span className="invisible pointer-events-none" aria-hidden="true">
        {longestString}
      </span>
      {/* Absolute typing text layer */}
      <span className="absolute left-0 top-0 flex items-center h-full w-max">
        <span className={gradientClass}>{displayText}</span>
        <span className="ml-[2px] w-[0.08em] h-[0.9em] bg-gray-900 dark:bg-white animate-[pulse_1s_infinite] inline-block rounded-full opacity-80" />
      </span>
    </span>
  );
};
