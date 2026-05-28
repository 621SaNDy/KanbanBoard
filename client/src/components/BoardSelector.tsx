import { useState } from "react";
import type { BoardModel } from "../types/models";
import { Board } from "./Board";

type BoardSelectorProps = {
  boards: BoardModel[];
};

export function BoardSelector({ boards }: BoardSelectorProps) {
  const [items, setItems] = useState<BoardModel[]>(boards);
  const [newBoardName, setNewBoardName] = useState("");

  const addBoard = () => {
    const board: BoardModel = {
      id: Math.round(Math.random() * 1000),
      name: newBoardName,
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
      <input
        type="text"
        placeholder="bornejm"
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
      />
      <button onClick={addBoard}>bord</button>
    </>
  );
}
