type TopMenuItemProps = {
  icon: string;
  click: () => void;
};

export function TopMenuItem({ icon, click }: TopMenuItemProps) {
  return (
    <div className="flex p-2 hover:bg-fg hover:text-bg" onClick={click}>
      <i className={`hn hn-${icon}`} />
    </div>
  );
}
