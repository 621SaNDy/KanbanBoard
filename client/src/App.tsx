import { useRef } from "react";
import "./App.css";
import { StretchableCard } from "./components/StretchableCard";

function App() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        id="grid"
        ref={gridRef}
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <StretchableCard
          color="#c32327"
          title="Zrobić wygląd strony, ewentualnie iść się zabić"
          labels={[
            { name: "zarazka", color: "#10adaa" },
            { name: "święte piekło", color: "#c72055" },
            { name: "cholibcia", color: "#dac71c" },
            { name: "cholibcia", color: "#dac71c" },
            { name: "cholibcia", color: "#dac71c" },
            { name: "cholibcia", color: "#dac71c" },
          ]}
        />
        <StretchableCard
          color="#f27238"
          title="Przetestować zmiany"
          description="Albo nie. W sumie po co testować zmiany?"
          deadline="30-05-2025 15:00"
          labels={[{ name: "nuuuuuuuuuuuuuudy", color: "#25ad10" }]}
        />
        <StretchableCard
          color="#fcb632"
          title="Czy to działa?"
          description="Wszystko leży, nic nie działa, ekran zalany błędami... Może pytanie Klaudiusza nie było dobrym pomysłem...?"
          deadline="21-06-2025"
          comments={["wtf", "Co tu się dzieje???"]}
        />
      </div>
    </>
  );
}

export default App;
