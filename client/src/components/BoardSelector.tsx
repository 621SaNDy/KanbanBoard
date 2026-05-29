import { useEffect, useState } from "react";
import type { BoardModel, BoardRequest } from "../types/models";
import { Board } from "./Board";
import { ServerConnection } from "../utilities/ServerConnection";

type BoardSelectorProps = {};

export function BoardSelector({}: BoardSelectorProps) {
  const [boards, setBoards] = useState<BoardModel[]>([]);
  const [newBoardName, setNewBoardName] = useState("");

  const loadBoards = async () => {
    const newBoards: BoardModel[] = await ServerConnection.get("/boards");
    setBoards(newBoards);
  };

  const addBoard = async () => {
    const board: BoardRequest = { name: newBoardName };
    await ServerConnection.post("/boards", board);
    loadBoards();
  };

  const removeBoard = async (boardId: number) => {
    await ServerConnection.delete(`/boards/${boardId}`);
    loadBoards();
  };

  useEffect(() => {
    loadBoards();
  }, []);

  return (
    <>
      {boards.map(({ id, name }) => (
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
