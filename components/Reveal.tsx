"use client";

import { useEffect, useRef, useState, CSSProperties } from "react";

interface RevealProps {
  children: React.ReactNode;
  id?: string;
  style?: CSSProperties;
  tag?: keyof React.JSX.IntrinsicElements;
}

export default function Reveal({ children, id, style, tag }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = (tag || "section") as React.ElementType;

  return (
    <Tag
      ref={ref}
      id={id}
      data-screen-label={id}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      {children}
    </Tag>
  );
}
