
import React, { useState } from 'react';

type SquareValue = 'X' | 'O' | null;

const Square: React.FC<{ value: SquareValue; onClick: () => void }> = ({ value, onClick }) => (
  <button
    className="w-24 h-24 bg-gray-700 text-4xl font-bold flex items-center justify-center rounded-lg hover:bg-gray-600"
    onClick={onClick}
  >
    {value}
  </button>
);

const calculateWinner = (squares: SquareValue[]): SquareValue => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToe: React.FC = () => {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="h-full bg-gray-900 rounded-b-lg p-4 flex flex-col items-center justify-center">
      <div className="text-2xl mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {squares.map((_, i) => (
          <Square key={i} value={squares[i]} onClick={() => handleClick(i)} />
        ))}
      </div>
      <button
        onClick={handleReset}
        className="mt-4 px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
