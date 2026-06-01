import "./App.css";
import { useState, useEffect } from "react";
import { Board } from "./components/Board";
import { CardDragLayer } from "./components/CardDragLayer";
import { SideMenu } from "./components/SideMenu";
import type { BoardModel } from "./types/models";
import { ServerConnection } from "./utilities/ServerConnection";
import type { BoardRequest } from "./types/requests";

function App() {
  const [boards, setBoards] = useState<BoardModel[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState(0);
  const [autoEditBoardId, setAutoEditBoardId] = useState(0);

  const loadBoards = async () => {
    const newBoards: BoardModel[] = await ServerConnection.get("/boards");
    setBoards(newBoards);
  };

  const addBoard = async () => {
    const boardData: BoardRequest = { name: "New board, how exciting!" };
    const newBoard: BoardModel = await ServerConnection.post(
      "/boards",
      boardData,
    );
    setAutoEditBoardId(newBoard.id);
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
    <div className="h-full w-full flex gap-4 p-4 text-fg bg-bg">
      <SideMenu
        boards={boards}
        currentBoard={currentBoardId}
        addBoard={addBoard}
        setCurrentBoard={setCurrentBoardId}
      />

      {(() => {
        const board = boards.find(({ id }) => id === currentBoardId);
        return (
          <>
            {board ? (
              <Board
                id={board.id}
                name={board.name}
                editBoardName={editBoardName}
                removeBoard={removeBoard}
                isAutoEditEnabled={autoEditBoardId === board.id}
                setAutoEditUsed={() => setAutoEditBoardId(0)}
              />
            ) : (
              <div className="flex-1 flex justify-center items-center text-center">
                <p>
                  No boards yet!
                  <br />
                  Use the "+" button on the left to create one.
                </p>
              </div>
            )}
          </>
        );
      })()}
      <CardDragLayer />
    </div>
  );
}

export default App;
