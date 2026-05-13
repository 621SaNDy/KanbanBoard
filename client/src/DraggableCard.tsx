import { useRef, useState, useEffect } from "react";
import useWindowDimensions from "./hooks/useWindowDimensions";

declare global {
  interface Number {
    clamp: (min: number, max: number) => number;
  }
}
Number.prototype.clamp = function (min: number, max: number): number {
  return Math.min(Math.max(this.valueOf(), min), max);
};

const FRICTION = 0.85;
const MIN_VELOCITY = 0.3;

export default function DraggableCard() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const [position, setPosition] = useState({ x: 10, y: 10 });
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const inertiaFrameRequest = useRef<number | null>(null);

  const clampToWindowDimensions = (coords: { x: number; y: number; }) => {
    return {
      x: coords.x.clamp(10, windowWidth - 110),
      y: coords.y.clamp(10, windowHeight - 110),
    };
  };

  const stopInertia = () => cancelAnimationFrame(inertiaFrameRequest.current as number);

  const runInertia = () => {
    velocity.current.x *= FRICTION;
    velocity.current.y *= FRICTION;

    if (
      Math.abs(velocity.current.x) < MIN_VELOCITY &&
      Math.abs(velocity.current.y) < MIN_VELOCITY
    ) {
      return;
    }

    setPosition((p) =>
      clampToWindowDimensions({
        x: p.x + velocity.current.x,
        y: p.y + velocity.current.y,
      }),
    );
    inertiaFrameRequest.current = requestAnimationFrame(runInertia);
  }

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    stopInertia();
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPosition.current = position;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      velocity.current = {
        x: e.clientX - lastMouse.current.x,
        y: e.clientY - lastMouse.current.y,
      };
      lastMouse.current = { x: e.clientX, y: e.clientY };

      setPosition(
        clampToWindowDimensions({
          x: startPosition.current.x + (e.clientX - startMouse.current.x),
          y: startPosition.current.y + (e.clientY - startMouse.current.y),
        })
      );
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      inertiaFrameRequest.current = requestAnimationFrame(runInertia);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [runInertia]);

  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        width: 100,
        height: 100,
        cursor: dragging.current ? "grabbing" : "grab",
        userSelect: "none",
        transition: "background 0.25s",
        border: "2px solid mediumspringgreen",
        borderRadius: 20,
        background: dragging.current ? "mediumseagreen" : "black"
      }}
    />
  );
}
