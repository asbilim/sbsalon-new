import React from "react";

export function DefaultLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      {/* Main circular background */}
      <circle cx="24" cy="24" r="22" fill="#121212" />

      {/* Gold circular accent */}
      <circle cx="24" cy="24" r="18" stroke="#D4AF37" strokeWidth="1.5" />

      {/* Stylized "S" for Salon with gradient */}
      <path
        d="M29.5 15C29.5 15 23 14 19 17C15 20 14.5 24 17 26.5C19.5 29 24 28 27.5 29.5C31 31 31.5 34.5 29 36.5C26.5 38.5 20 38 17 36"
        stroke="url(#goldGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Scissors element */}
      <g stroke="url(#goldGradient)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="33" cy="18" r="2.5" />
        <circle cx="33" cy="30" r="2.5" />
        <path d="M33 18L26 24" />
        <path d="M33 30L26 24" />
      </g>

      {/* Gold gradient definition */}
      <defs>
        <linearGradient
          id="goldGradient"
          x1="14"
          y1="15"
          x2="35"
          y2="36"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#F2D675" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}
