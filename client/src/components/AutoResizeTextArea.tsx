import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

export const AutoResizeTextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function AutoResizeTextArea(props, ref) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => textAreaRef.current!, [textAreaRef.current]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) return;

    const handleResize = () => {
      textArea.style.height = "auto";
      textArea.style.height = textArea.scrollHeight + "px";
      textArea.style.overflowY = "hidden";
    };
    handleResize();
    textArea.addEventListener("input", handleResize);

    return () => textArea.removeEventListener("input", handleResize);
  }, []);

  return <textarea ref={textAreaRef} {...props} />;
});
