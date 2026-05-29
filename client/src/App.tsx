import "./App.css";
import { BoardSelector } from "./components/BoardSelector";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  useDarkMode();

  return (
    <>
      <BoardSelector />
    </>
  );
}

export default App;
