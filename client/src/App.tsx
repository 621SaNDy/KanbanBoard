import "./App.css";
import { Board } from "./components/Board";

function App() {
  return (
    <Board
      id={1}
      name="zaraza"
      columns={[
        {
          id: 1,
          name: "zigga",
          position: 1,
          cards: [
            {
              id: 1,
              title:
                "Zrobić wygląd strony, ewentualnie iść się zabić albo coś, jakby bruuuuuuh, czemu ja sobie to tak utrudniam?",
              description: "Lorem ipsum dolor sit amet?",
              dueDate: "01-06-2025 00:00",
              color: "#c32327",
              labels: [
                { name: "zarazka", color: "#10adaa" },
                { name: "święte piekło", color: "#c72055" },
                { name: "cholibcia", color: "#dac71c" },
                { name: "cholibcia", color: "#dac71c" },
                { name: "cholibcia", color: "#dac71c" },
                { name: "cholibcia", color: "#dac71c" },
              ],
            },
            {
              id: 2,
              title: "Przetestować zmiany",
              description: "Albo nie. W sumie po co testować zmiany?",
              dueDate: "30-05-2025 15:00",
              color: "#f27238",
              labels: [{ name: "nuuuuuuuuuuuuuudy", color: "#25ad10" }],
            },
            {
              id: 3,
              title: "Czy to działa?",
              description:
                "Wszystko leży, nic nie działa, ekran zalany błędami... Może pytanie Klaudiusza nie było dobrym pomysłem...?",
              dueDate: "21-06-2025",
              color: "#fcb632",
              comments: ["wtf", "Co tu się dzieje???"],
            },
            {
              id: 4,
              title: "Przepisać WSZYSTKO od zera",
              description: "Zaraza, wygląda na to, że tak tego nie zrobimy...",
              dueDate: "26-05-2025",
              color: "#0b7978",
            },
            {
              id: 5,
              title: "Przeanalizować możliwości wyrzucenia projektu do kosza",
              color: "#811638",
              labels: [{ name: "bruh", color: "#aaaaaa" }],
            },
          ],
        },
      ]}
    />
  );
}

export default App;
