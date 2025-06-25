import * as React from "react";

export const DefaultLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}>
    {/* Stylized S for Salon */}
    <path d="M14.5,4c0,0-3-0.5-5.5,1s-2.5,3.5-1.5,5s3.5,1.5,5.5,2s3,2.5,2,4s-3,2-5.5,2" 
          strokeWidth="2"
          fill="none" />
    
    {/* Scissors */}
    <circle cx="18" cy="6" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
    <line x1="18" y1="6" x2="10" y2="12" />
    <line x1="18" y1="18" x2="10" y2="12" />
  </svg>
);
