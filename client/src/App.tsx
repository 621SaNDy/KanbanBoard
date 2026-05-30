import "./App.css";
import { BoardSelector } from "./components/BoardSelector";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  useDarkMode();

  return (
    <div className="h-full">
      <BoardSelector />
    </div>
  );
}

export default App;
