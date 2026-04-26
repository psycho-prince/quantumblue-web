"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 h-full w-full pointer-events-none overflow-hidden",
        className
      )}
    >
      <svg
        className="absolute left-0 top-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M-100 100 L1100 1100"
          stroke="url(#beam-gradient)"
          strokeWidth="2"
          fill="none"
          className="animate-[beam_10s_linear_infinite]"
        />
        <path
          d="M200 -100 L1200 900"
          stroke="url(#beam-gradient)"
          strokeWidth="2"
          fill="none"
          className="animate-[beam_15s_linear_infinite_reverse]"
        />
      </svg>
      <style jsx>{`
        @keyframes beam {
          0% {
            stroke-dasharray: 0 1000;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 1000 1000;
            stroke-dashoffset: -500;
          }
          100% {
            stroke-dasharray: 0 1000;
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  );
};
