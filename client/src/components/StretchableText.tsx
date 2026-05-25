import { useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { tintColor } from "../utilities/tintColor";

type StretchableTextProps = {
  text: string;
  className?: string;
  color?: string;
  fontFamily?: string;
  fontWeight?: number | string;
};

export function StretchableText({
  text,
  className = "",
  color = "#000",
  fontFamily = "inherit",
  fontWeight = 900,
}: StretchableTextProps) {
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
      viewBox={`${box.x} ${box.y + box.height * 0.1} ${box.width} ${box.height - box.height * 0.2}`}
    >
      <motion.text
        // initial={{ fill: tintColor(color, -0.35) }}
        animate={{ fill: color }}
        transition={{ duration: 0.2, /*delay: 1*/ }}
        ref={textRef}
        x="0"
        y="0"
        dominantBaseline="hanging"
        fontSize="1000"
        fontFamily={fontFamily}
        fontWeight={fontWeight}
      >
        {text}
      </motion.text>
    </svg>
  );
}
