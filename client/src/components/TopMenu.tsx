import { TopMenuItem } from "./TopMenuItem";
import { TopMenuSearchBar } from "./TopMenuSearchBar";

type TopMenuProps = {
  title: string;
};

export function TopMenu({ title }: TopMenuProps) {
  return (
    <div className="shadow-border-rounded inset-shadow-border m-border flex items-center pl-4 pr-4">
      <h1>{title}</h1>

      <div className="flex-1 flex justify-end pr-4">
        <TopMenuItem icon="exclamation-triangle" click={() => {}} />
        <TopMenuItem icon="tag" click={() => {}} />
        <TopMenuItem icon="filter" click={() => {}} />
      </div>
      <TopMenuSearchBar />
    </div>
  );
}
