"use client";

import React, { useEffect, useRef, useState } from "react";

export function LatticeVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const rows = 12;
  const cols = 18;
  const spacing = 70;

  const getPoint = (i: number, j: number) => {
    const x = j * spacing + (i % 2 === 0 ? 0 : spacing / 2);
    const y = i * spacing;
    
    const dx = x - mousePos.x;
    const dy = y - mousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 400;
    const strength = Math.max(0, 1 - dist / maxDist);
    
    // Smooth magnetic pull
    const offsetX = dx * strength * 0.2;
    const offsetY = dy * strength * 0.2;

    return { x: x + offsetX, y: y + offsetY, strength };
  };

  interface Point {
    x: number;
    y: number;
    strength: number;
  }

  const points: Point[][] = [];
  for (let i = 0; i < rows; i++) {
    points[i] = [];
    for (let j = 0; j < cols; j++) {
      points[i][j] = getPoint(i, j);
    }
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        {points.map((row, i) =>
          row.map((p, j) => (
            <React.Fragment key={`${i}-${j}`}>
              {/* Horizontal */}
              {j < cols - 1 && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={points[i][j+1].x}
                  y2={points[i][j+1].y}
                  stroke={p.strength > 0.3 ? "#3B82F6" : "#1E293B"}
                  strokeWidth="0.5"
                  strokeOpacity={0.1 + p.strength * 0.4}
                  className="transition-colors duration-300"
                />
              )}
              {/* Vertical */}
              {i < rows - 1 && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={points[i+1][j].x}
                  y2={points[i+1][j].y}
                  stroke={p.strength > 0.3 ? "#3B82F6" : "#1E293B"}
                  strokeWidth="0.5"
                  strokeOpacity={0.1 + p.strength * 0.4}
                  className="transition-colors duration-300"
                />
              )}
              {/* Diagonal */}
              {i < rows - 1 && j < cols - 1 && (
                <line
                  x1={p.x}
                  y1={p.y}
                  x2={points[i+1][j+1].x}
                  y2={points[i+1][j+1].y}
                  stroke="#1E293B"
                  strokeWidth="0.3"
                  strokeOpacity={0.05 + p.strength * 0.2}
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={p.strength > 0.5 ? 1.5 : 1}
                fill={p.strength > 0.5 ? "#3B82F6" : "#334155"}
                className="transition-all duration-300"
              />
            </React.Fragment>
          ))
        )}
      </svg>
    </div>
  );
}
