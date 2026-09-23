import React, { useState, useEffect } from "react";

interface ComfortableTypewriterProps {
  words: string[];
  baseTypingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export const ComfortableTypewriter: React.FC<ComfortableTypewriterProps> = ({
  words,
  baseTypingSpeed = 85,
  pauseDuration = 2800,
  className = "",
  cursorClassName = "",
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetWord = words[currentWordIndex];

    if (!isDeleting) {
      if (currentText.length < targetWord.length) {
        let delay: number;

        if (currentText.length === 0) {
          delay = 190 + Math.random() * 80;
        } else {
          const rand = Math.random();
          if (rand < 0.12) {
            delay = baseTypingSpeed + 90 + Math.random() * 80;
          } else if (rand > 0.72) {
            delay = Math.max(35, baseTypingSpeed - 35 + Math.random() * 20);
          } else {
            delay = baseTypingSpeed + (Math.random() * 40 - 20);
          }
        }

        const timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length + 1));
        }, delay);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timer);
      }
    } else {
      if (currentText.length > 0) {
        const charactersRemaining = currentText.length;
        const totalCharacters = targetWord.length;
        const erasedSoFar = totalCharacters - charactersRemaining;
        const acceleration = Math.min(38, erasedSoFar * 4.5);
        const dynamicDeleteSpeed = Math.max(24, 65 - acceleration + (Math.random() * 12 - 6));

        const timer = setTimeout(() => {
          setCurrentText(targetWord.slice(0, currentText.length - 1));
        }, dynamicDeleteSpeed);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 320 + Math.random() * 60);
        return () => clearTimeout(timer);
      }
    }
  }, [currentText, isDeleting, currentWordIndex, words, baseTypingSpeed, pauseDuration]);

  const isWordComplete = currentText === words[currentWordIndex];

  return (
    <span className={`inline-flex items-baseline ${className}`} aria-label={words[currentWordIndex]}>
      <span>{currentText}</span>
      <span
        className={`inline-block w-[3px] ml-1 bg-sky-500 rounded-full align-middle select-none shadow-[0_0_10px_rgba(2,132,199,0.9)] transition-opacity duration-300 ${
          isWordComplete ? "animate-cursor-blink" : "opacity-100"
        } ${cursorClassName}`}
        aria-hidden="true"
      />
    </span>
  );
};

export default ComfortableTypewriter;
