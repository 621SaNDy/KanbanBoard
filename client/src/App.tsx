import "./App.css"
import { AnimatePresence, motion } from "motion/react"
import useWindowDimensions from "./hooks/useWindowDimensions"
import { useRef, useState } from "react";

function App() {
  const { width, height } = useWindowDimensions();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [isDraggable, setIsDraggable] = useState(false);

  const boxes = ["red", "green", "blue", "yellow", "magenta", "cyan"].map((color, index) => {
    setTimeout(() => {
      setIsDraggable(true);
    }, 2000)
  
    const boxVariants = {
      hidden: { 
        scale: 0,
        opacity: 0,
        transition: { delay: 0.2 * (index) } 
      },
      visible: { 
        scale: 1,
        opacity: 1,
        transition: { delay: 0.2 * (index) } 
      }
    };

    return (
      <motion.div
        variants={boxVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ width: 100, height: 100, backgroundColor: color }}
        drag={isDraggable}
        dragElastic={0.2}
        dragTransition={{
          power: 0.5,
          bounceStiffness: 700,
          bounceDamping: 20
        }}
        whileDrag={{ scale: 1.1, boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", zIndex: 999}}
        dragConstraints={gridRef}
      />
    )
  })

  return (
    <>
      <div id="grid" ref={gridRef} style={{ display: "flex", gap: 10 }}>
        <h1 style={{ color: "white", position: "fixed", zIndex: 9999, pointerEvents: "none" }}>{width}x{height}</h1>
        
        <AnimatePresence>
          {boxes}
        </AnimatePresence>
        
      </div>
    </>
  )
}

export default App