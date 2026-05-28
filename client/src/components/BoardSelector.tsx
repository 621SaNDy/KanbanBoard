import { useState } from "react";
import type { BoardModel } from "../types/models";
import { Board } from "./Board";

type BoardSelectorProps = {
  boards: BoardModel[];
};

export function BoardSelector({ boards }: BoardSelectorProps) {
  const [items, setItems] = useState<BoardModel[]>(boards);

  const addBoard = () => {
    const board: BoardModel = {
      id: Math.round(Math.random() * 1000),
      name: "zarózka",
      columns: [],
    };
    setItems([...items, board]);
  };

  const removeBoard = (boardId: number) => {
    setItems(items.filter(({ id }: BoardModel) => id !== boardId));
  };

  return (
    <>
      {items.map(({ id, name, columns }) => (
        <Board
          key={id}
          id={id}
          name={name}
          columns={columns}
          remove={removeBoard}
        />
      ))}
      <button onClick={addBoard}>bord</button>
    </>
  );
}
