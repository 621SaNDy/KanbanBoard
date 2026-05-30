import { useEffect, useState } from "react";
import type { BoardModel, BoardRequest } from "../types/models";
import { Board } from "./Board";
import { ServerConnection } from "../utilities/ServerConnection";
import { TopMenu } from "./TopMenu";
import { SideMenu } from "./SideMenu";

type BoardSelectorProps = {};

export function BoardSelector({}: BoardSelectorProps) {
  const [boards, setBoards] = useState<BoardModel[]>([]);
  const [currentBoard, setCurrentBoard] = useState(0);
  const [newBoardName, setNewBoardName] = useState("");

  const loadBoards = async () => {
    const newBoards: BoardModel[] = await ServerConnection.get("/boards");
    setBoards(newBoards);
  };

  const addBoard = async () => {
    const board: BoardRequest = { name: newBoardName };
    await ServerConnection.post("/boards", board);
    setNewBoardName("");
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
    <div className="h-full w-full flex gap-5 p-5">
      <SideMenu boards={boards} />

      {(() => {
        const board = boards[currentBoard];
        return (
          <div className="flex flex-col gap-5 h-full w-full">
            {board ? (
              <>
                <TopMenu title={board.name} />
                <Board id={board.id} name={board.name} remove={removeBoard} />
              </>
            ) : null}
          </div>
        );
      })()}

      {/* <input
        type="text"
        placeholder="bornejm"
        value={newBoardName}
        onChange={(e) => setNewBoardName(e.target.value)}
      />
      <button onClick={addBoard}>bord</button> */}
    </div>
  );
}
