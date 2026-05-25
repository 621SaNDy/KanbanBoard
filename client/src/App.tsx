import "./App.css";
import { Column } from "./components/Column";

function App() {
  const cards = [
    {
      title: "Zrobić wygląd strony, ewentualnie iść się zabić albo coś, jakby bruuuuuuh, czemu ja sobie to tak utrudniam? XD",
      description: "Lorem ipsum dolor sit amet?",
      deadline: "01-06-2025 00:00",
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
      title: "Przetestować zmiany",
      description: "Albo nie. W sumie po co testować zmiany?",
      deadline: "30-05-2025 15:00",
      color: "#f27238",
      labels: [{ name: "nuuuuuuuuuuuuuudy", color: "#25ad10" }],
    },
    {
      title: "Czy to działa?",
      description:
        "Wszystko leży, nic nie działa, ekran zalany błędami... Może pytanie Klaudiusza nie było dobrym pomysłem...?",
      deadline: "21-06-2025",
      color: "#fcb632",
      comments: ["wtf", "Co tu się dzieje???"],
    },
    {
      title: "Przepisać WSZYSTKO od zera",
      description:
        "Zaraza, wygląda na to, że tak tego nie zrobimy...",
      deadline: "26-05-2025",
      color: "#0b7978",
    },
    {
      title: "Przeanalizować możliwości wyrzucenia projektu do kosza",
      color: "#811638",
      labels: [{name: "bruh", color: "#aaaaaa"}]
    },
  ];

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        gap: 10,
        padding: 10,
      }}
    >
      <Column title="To do" cards={cards} />
      <Column title="Pending" cards={cards} />
      <Column title="In progress" cards={cards} />
      <Column title="In review" cards={cards} />
      <Column title="Completed" cards={cards} />
    </div>
  );
}

export default App;
