import { useEffect, useState } from "react";
import type { BoardModel, BoardWithColumnsModel } from "../types/models";
import { Board } from "./Board";
import { fetchServer } from "../utilities/fetchServer";

type BoardSelectorProps = {};

export function BoardSelector({}: BoardSelectorProps) {
  const [items, setItems] = useState<BoardModel[]>([]);
  const [newBoardName, setNewBoardName] = useState("");

  const fetchBoards = async () => {
    return await fetchServer("/boards");
  };

  const addBoard = () => {
    const board: BoardWithColumnsModel = {
      id: Math.round(Math.random() * 1000),
      name: newBoardName,
      columns: [],
    };
    setItems([...items, board]);
  };

  const removeBoard = (boardId: number) => {
    setItems(items.filter(({ id }: BoardModel) => id !== boardId));
  };

  useEffect(() => {
    const loadBoards = async () => {
      const boards: BoardModel[] = await fetchBoards();
      setItems(boards);
    };
    loadBoards();
  }, []);

  return (
    <>
      {items.map(({ id, name }) => (
        <Board key={id} id={id} name={name} remove={removeBoard} />
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
