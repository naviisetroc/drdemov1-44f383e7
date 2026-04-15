import React from "react";
import { Camera, Paperclip } from "lucide-react";

interface CameraClipIconProps {
  className?: string;
  size?: number;
}

/**
 * Composite icon showing a camera and paperclip together,
 * indicating both photo and file upload capability.
 */
export default function CameraClipIcon({ className, size }: CameraClipIconProps) {
  const s = size ?? 16;
  return (
    <span className={`relative inline-flex items-center justify-center ${className ?? ""}`} style={{ width: s, height: s }}>
      <Camera className="absolute top-0 left-0" style={{ width: s * 0.75, height: s * 0.75 }} />
      <Paperclip
        className="absolute bottom-0 right-0"
        style={{ width: s * 0.55, height: s * 0.55 }}
      />
    </span>
  );
}
