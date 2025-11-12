import React from "react";

export default function Ring({ value = 75 }) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * (1 - value / 100);

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      <circle cx="90" cy="90" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="14" fill="none" />
      <circle
        cx="90"
        cy="90"
        r={radius}
        stroke="#60a5fa"
        strokeWidth="14"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
      />
      <text x="90" y="92" textAnchor="middle" className="fill-white text-3xl font-semibold">
        {value}%
      </text>
      <text x="90" y="116" textAnchor="middle" className="fill-slate-300/80 text-xs">
        Subjects Covered
      </text>
    </svg>
  );
}
