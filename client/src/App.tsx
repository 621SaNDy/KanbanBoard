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
          flexDirection: "column"
        }}
      >
        <StretchableCard
          title="Zrobić wygląd strony, ewentualnie iść się zabić"
          description="Coś tam by trzeba wymyślić, bo jakieś brzydkie to wszystko"
          due="23-05-2025 13:15"
          color="#ff1d1d"
        />
        <StretchableCard
          title="Przetestować zmiany"
          description="Albo nie. W sumie po co testować zmiany?"
          due="30-05-2025 15:00"
          color="#1dfbff"
        />
        <StretchableCard
          title="Czy to działa?"
          description="Wszystko leży, nic nie działa, ekran zalany błędami... Może pytanie Klaudiusza nie było dobrym pomysłem...?"
          due="21-06-2025"
          color="#3bff1d"
        />
      </div>
    </>
  );
}

export default App;
