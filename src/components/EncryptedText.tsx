"use client";

import { useEffect, useState } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export function EncryptedText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    if (!isRevealing) return;

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        prev
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
        setIsRevealing(false);
      }

      iterations += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isRevealing, text]);

  return (
    <span
      className={className}
      onMouseEnter={() => setIsRevealing(true)}
      style={{ cursor: "pointer" }}
    >
      {displayText}
    </span>
  );
}
