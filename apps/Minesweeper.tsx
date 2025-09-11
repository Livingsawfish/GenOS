
import React, { useState, useEffect } from 'react';

const ROWS = 10;
const COLS = 10;
const MINES = 10;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type GameStatus = 'playing' | 'won' | 'lost';

const createEmptyBoard = (): CellState[][] => {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
};

const plantMines = (board: CellState[][], initialClick: { r: number; c: number }): CellState[][] => {
  let minesPlaced = 0;
  const newBoard = JSON.parse(JSON.stringify(board));

  while (minesPlaced < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);

    // Don't place a mine on the first click or where one already is
    if (!newBoard[r][c].isMine && (r !== initialClick.r || c !== initialClick.c)) {
      newBoard[r][c].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate adjacent mines
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (newBoard[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
            count++;
          }
        }
      }
      newBoard[r][c].adjacentMines = count;
    }
  }

  return newBoard;
};

const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<CellState[][]>(createEmptyBoard());
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [firstClick, setFirstClick] = useState(true);
  const [flags, setFlags] = useState(MINES);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameStatus('playing');
    setFirstClick(true);
    setFlags(MINES);
  };
  
  const checkWinCondition = (currentBoard: CellState[][]) => {
      for(let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
              if(!currentBoard[r][c].isMine && !currentBoard[r][c].isRevealed) {
                  return false;
              }
          }
      }
      return true;
  }

  const revealCell = (r: number, c: number, currentBoard: CellState[][]): CellState[][] => {
    const newBoard = JSON.parse(JSON.stringify(currentBoard));
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) {
      return newBoard;
    }

    newBoard[r][c].isRevealed = true;
    
    if (newBoard[r][c].adjacentMines === 0 && !newBoard[r][c].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          Object.assign(newBoard, revealCell(r + dr, c + dc, newBoard));
        }
      }
    }
    return newBoard;
  };

  const handleClick = (r: number, c: number) => {
    if (gameStatus !== 'playing') return;

    let currentBoard = board;
    if (firstClick) {
      currentBoard = plantMines(board, { r, c });
      setFirstClick(false);
    }
    
    if (currentBoard[r][c].isFlagged) return;

    if (currentBoard[r][c].isMine) {
      setGameStatus('lost');
      const finalBoard = currentBoard.map(row => row.map(cell => ({...cell, isRevealed: true})));
      setBoard(finalBoard);
      return;
    }

    const newBoard = revealCell(r, c, currentBoard);
    
    if(checkWinCondition(newBoard)) {
        setGameStatus('won');
    }
    
    setBoard(newBoard);
  };
  
  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      if(gameStatus !== 'playing' || board[r][c].isRevealed) return;

      const newBoard = JSON.parse(JSON.stringify(board));
      const cell = newBoard[r][c];

      if(cell.isFlagged) {
          cell.isFlagged = false;
          setFlags(prev => prev + 1);
      } else if (flags > 0) {
          cell.isFlagged = true;
          setFlags(prev => prev - 1);
      }
      setBoard(newBoard);
  }

  const getCellContent = (cell: CellState) => {
    if (gameStatus === 'lost' && cell.isMine) return '💣';
    if (!cell.isRevealed) {
      return cell.isFlagged ? '🚩' : '';
    }
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };
  
  const getNumberColor = (num: number) => {
      switch(num) {
          case 1: return 'text-blue-500';
          case 2: return 'text-green-500';
          case 3: return 'text-red-500';
          case 4: return 'text-purple-500';
          case 5: return 'text-maroon-500';
          case 6: return 'text-turquoise-500';
          case 7: return 'text-black';
          case 8: return 'text-gray-500';
          default: return '';
      }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-900 rounded-b-lg p-4">
        <div className="w-full max-w-sm p-2 bg-gray-800 rounded-lg mb-4 flex justify-between items-center">
            <div className="text-red-500 font-bold text-2xl">{String(flags).padStart(3, '0')}</div>
            <button onClick={resetGame} className="text-3xl">
                {gameStatus === 'playing' && '😊'}
                {gameStatus === 'won' && '😎'}
                {gameStatus === 'lost' && '😵'}
            </button>
            <div className="text-red-500 font-bold text-2xl">000</div>
        </div>
        <div className="grid grid-cols-10 gap-0.5 bg-gray-700 p-1 rounded">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className={`w-8 h-8 flex items-center justify-center font-bold text-xl
                ${cell.isRevealed ? 'bg-gray-600 border-gray-500 border' : 'bg-gray-500 hover:bg-gray-400 border-outset'}
                ${getNumberColor(cell.adjacentMines)}
              `}
              disabled={gameStatus !== 'playing'}
            >
              {getCellContent(cell)}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Minesweeper;
