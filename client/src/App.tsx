import "./App.css";
import { useState, useEffect } from "react";
import { Board } from "./components/Board";
import { CardDragLayer } from "./components/CardDragLayer";
import { ColumnDragLayer } from "./components/ColumnDragLayer";
import { SideMenu } from "./components/SideMenu";
import { TopMenu } from "./components/TopMenu";
import type { BoardModel } from "./types/models";
import { ServerConnection } from "./utilities/ServerConnection";
import type { BoardRequest } from "./types/requests";

function App() {
  const [boards, setBoards] = useState<BoardModel[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState(0);

  const loadBoards = async () => {
    const newBoards: BoardModel[] = await ServerConnection.get("/boards");
    setBoards(newBoards);
  };

  const addBoard = async () => {
    const boardData: BoardRequest = { name: "New board" };
    const newBoard: BoardModel = await ServerConnection.post(
      "/boards",
      boardData,
    );
    setCurrentBoardId(newBoard.id);
    loadBoards();
  };

  const editBoardName = async (boardId: number, name: string) => {
    const boardData: BoardRequest = { name: name };
    await ServerConnection.patch(`/boards/${boardId}`, boardData);
    loadBoards();
  };

  const removeBoard = async (boardId: number) => {
    await ServerConnection.delete(`/boards/${boardId}`);
    loadBoards();
  };

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (!currentBoardId || !boards.find(({ id }) => id === currentBoardId)) {
      setCurrentBoardId(boards[0]?.id ?? 0);
    }
  }, [boards]);

  return (
    <div className="h-full w-full flex gap-3 p-5 text-fg bg-bg">
      <SideMenu
        boards={boards}
        currentBoard={currentBoardId}
        addBoard={addBoard}
        setCurrentBoard={setCurrentBoardId}
      />

      {(() => {
        const board = boards.find(({ id }) => id === currentBoardId);
        return (
          <div className="flex flex-col gap-5 h-full w-full">
            {board ? (
              <>
                <TopMenu
                  board={board}
                  editBoardName={editBoardName}
                  removeBoard={removeBoard}
                />
                <Board id={board.id} name={board.name} remove={removeBoard} />
              </>
            ) : null}
          </div>
        );
      })()}
      <CardDragLayer />
      <ColumnDragLayer />
    </div>
  );
}

export default App;
