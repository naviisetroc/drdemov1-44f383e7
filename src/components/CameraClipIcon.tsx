import React from "react";

interface CameraClipIconProps {
  className?: string;
}

/**
 * Composite icon: camera with a diagonal slash and a paperclip,
 * indicating both photo and file upload capability.
 */
export default function CameraClipIcon({ className = "h-4 w-4" }: CameraClipIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Camera body */}
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      {/* Camera lens */}
      <circle cx="12" cy="13" r="3" />
      {/* Diagonal line */}
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2.5" />
      {/* Paperclip - small, bottom-right area */}
      <path d="M19.5 15.5l-2.5-2.5a1.5 1.5 0 0 1 2.12-2.12l2.5 2.5a1.5 1.5 0 0 1-2.12 2.12z" strokeWidth="1.5" />
    </svg>
  );
}
