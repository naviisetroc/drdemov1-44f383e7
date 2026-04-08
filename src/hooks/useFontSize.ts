import { useState, useEffect } from "react";

const STORAGE_KEY = "medisec_font_size";
const SIZES = [
  { label: "A", value: 100 },
  { label: "A+", value: 120 },
  { label: "A++", value: 140 },
];

export function useFontSize() {
  const [sizeIndex, setSizeIndex] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${SIZES[sizeIndex].value}%`;
    localStorage.setItem(STORAGE_KEY, String(sizeIndex));
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [sizeIndex]);

  function cycle() {
    setSizeIndex((i) => (i + 1) % SIZES.length);
  }

  return { label: SIZES[sizeIndex].label, cycle, sizeIndex };
}
