import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

/* ============================================== Square ======================================== */
interface SquareProps {
  value: string;
  onClick: () => void;
}

const Square = (props: Readonly<SquareProps>) => {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
};

/* ============================================== Board ======================================== */
interface BoardProps {
  value: string;
  onClick: (i: number) => void;
}

const Board = (props: Readonly<BoardProps>) => {
  const renderSquare = (i: number) => (
    <Square value={props.squares[i]} onClick={() => props.onClick(i)} />
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="boar-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

/* ============================================== Game ======================================== */

interface GameProps {}

interface History {
  squares: string[];
}

const Game = (props: GameProps) => {
  const [history, setHistory] = useState<History[]>([
    {
      squares: Array(9).fill("")
    }
  ]);

  const [stepNumber, setStepNumber] = useState<number>(0);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  const handleClick = (i: Readonly<number>) => {
    const thatTimeHistory = history.slice(0, stepNumber + 1);
    const currentSquares: History = thatTimeHistory[thatTimeHistory.length - 1];

    if (
      !calculateWinner(currentSquares.squares) &&
      !currentSquares.squares[i]
    ) {
      const squaresCopy = [...currentSquares.squares];
      squaresCopy[i] = xIsNext ? "X" : "O";

      setHistory(
        thatTimeHistory.concat([
          {
            squares: squaresCopy
          }
        ])
      );

      setStepNumber(stepNumber + 1);

      setXIsNext(!xIsNext);
    }
  };

  const jumpTo = (step: Readonly<number>) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  };

  const currentSquares: History = history[stepNumber];
  const winner: string = calculateWinner(currentSquares.squares);

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  const status = ((winner: string) => {
    if (winner === "O" || winner === "X") {
      return `Winner: ${winner}`;
    } else {
      return `Next player: ${xIsNext ? "X" : "O"}`;
    }
  })(winner);

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares.squares}
          onClick={(i: number) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
};

const calculateWinner = (squares: string[]) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return "";
};

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// import * as React from "react";
// import { render } from "react-dom";

// import App from "./App";

// const rootElement = document.getElementById("root");
// render(<App />, rootElement);
