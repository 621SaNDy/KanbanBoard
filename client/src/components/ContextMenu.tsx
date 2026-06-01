type ToolBoxProps = {
  children: React.ReactNode;
}

export function ContextMenu({ children }: ToolBoxProps) {
  return (
    <div className="shadow-border-rounded inset-shadow-border m-border flex flex-col bg-bg-secondary">
      {children}
    </div>
  )
}