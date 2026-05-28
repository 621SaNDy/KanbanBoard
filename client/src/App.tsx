import "./App.css";
import type { BoardModel } from "./types/models";
import { BoardSelector } from "./components/BoardSelector";

function App() {
  const boards: BoardModel[] = [
    {
      id: 1,
      name: "bórd",
      columns: [
        {
          id: 1,
          name: "board",
          position: 1,
          cards: [
            {
              id: 1,
              title:
                "Zrobić wygląd strony, ewentualnie iść się zabić albo coś, jakby bruuuuuuh, czemu ja sobie to tak utrudniam?",
              description: "Lorem ipsum dolor sit amet?",
              dueDate: "01-06-2025 00:00",
              position: 1,
              labels: [
                { id: 1, name: "zarazka", color: "#10adaa" },
                { id: 2, name: "święte piekło", color: "#c72055" },
                { id: 3, name: "cholibcia", color: "#dac71c" },
                { id: 4, name: "cholibcia", color: "#dac71c" },
                { id: 5, name: "cholibcia", color: "#dac71c" },
                { id: 6, name: "cholibcia", color: "#dac71c" },
              ],
            },
            {
              id: 2,
              title: "Przetestować zmiany",
              description: "Albo nie. W sumie po co testować zmiany?",
              dueDate: "30-05-2025 15:00",
              position: 2,
              labels: [{ id: 1, name: "nuuuuuuuuuuuuuudy", color: "#25ad10" }],
            },
            {
              id: 3,
              title: "Czy to działa?",
              description:
                "Wszystko leży, nic nie działa, ekran zalany błędami... Może pytanie Klaudiusza nie było dobrym pomysłem...?",
              dueDate: "21-06-2025",
              position: 3,
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <BoardSelector boards={boards} />
    </>
  );
}

export default App;
