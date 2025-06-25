"use client";

import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";

const Svg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    {/* Stylized S for Salon */}
    <path
      d="M14.5,4c0,0-3-0.5-5.5,1s-2.5,3.5-1.5,5s3.5,1.5,5.5,2s3,2.5,2,4s-3,2-5.5,2"
      strokeWidth="2"
      fill="none"
    />

    {/* Scissors */}
    <circle cx="18" cy="6" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
    <line x1="18" y1="6" x2="10" y2="12" />
    <line x1="18" y1="18" x2="10" y2="12" />
  </svg>
);

export function DefaultFavicon() {
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    const svgString = ReactDOMServer.renderToString(<Svg />);
    const faviconUri = `data:image/svg+xml;base64,${btoa(svgString)}`;
    setFavicon(faviconUri);
  }, []);

  if (!favicon) return null;

  return <link rel="icon" href={favicon} />;
}
