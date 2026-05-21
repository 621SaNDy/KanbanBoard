import { useLayoutEffect, useRef, useState } from "react";

type StretchTextProps = {
  text: string;
  className?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: number | string;
};

export function StretchableText({
  text,
  className = "",
  color = "",
  fontFamily = "inherit",
  fontWeight = 900,
}: StretchTextProps) {
  const textRef = useRef<SVGTextElement>(null);

  const [box, setBox] = useState({ x: 0, y: 0, width: 5000, height: 5000 });

  useLayoutEffect(() => {
    const update = () => {
      const element = textRef.current;
      if (!element) return;

      try {
        const bbox = element.getBBox();

        if (bbox.width && bbox.height) {
          setBox({
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
          });
        }
      } catch {}
    };
    update();

    const resizeObserver = new ResizeObserver(update);
    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [text, fontFamily, fontWeight]);

  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox={`${box.x} ${box.y} ${box.width} ${box.height}`}
    >
      <text
        ref={textRef}
        x="0"
        y="0"
        dominantBaseline="hanging"
        fill={color}
        fontSize="1000"
        fontFamily={fontFamily}
        fontWeight={fontWeight}
      >
        {text}
      </text>
    </svg>
  );
}
