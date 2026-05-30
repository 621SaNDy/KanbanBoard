type TopMenuItemProps = {
  icon: string;
  click: () => void;
};

export function TopMenuItem({ icon, click }: TopMenuItemProps) {
  return (
    <div className="flex pl-4 pr-4 pt-2 pb-2" onClick={click}>
      <i className={`hn hn-${icon}`} />
    </div>
  );
}
