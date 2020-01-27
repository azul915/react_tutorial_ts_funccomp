/* 参考先　https://note.com/tkugimot/n/nf7fe751298b1 */
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

/* ============================================== Square ======================================== */
// TypeScriptはプロパティの定義にInterfaceが必要
interface SquareProps {
  value: string;
  onClick: () => void;
}

// 関数コンポーネントは、render メソッドだけを有して自分の state を持たないコンポーネントを、よりシンプルに書くための方法
// 読込専用propsとして受け取る
const Square = (props: Readonly<SquareProps>) => {
  return (
    // 関数コンポーネントは引数からpropsを受け取るのでthisが要らない
    // onClick={props.onClick}でもよい
    // buttonタグのonClick属性は特別な意味を持つ
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

class Board extends React.Component<BoardProps> {
  // constructor()は、DOM挿入前の初期化時に呼ばれるメソッド
  // stateを使わずpropsだけのコンポーネントの場合など内容がsuper(props, context)だけの場合にはconstructorに記述自体を丸々省略できる。

  renderSquare(i: number) {
    return (
      // コンポーネントタグのonClickはReactにおける予約語ではない
      // イベントを表すpropsにはon[Event]、イベントを処理するメソッドにはhandle[Event]が名付けられる慣習
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/* ============================================== Game ======================================== */

interface GameProps {}

// interface Squares {
//   squares: string[];
// }

interface GameState {
  //history: Squares[];

  // interfaceをネストで表現する
  history: Array<{
    squares: string[];
  }>;
  stepNumber: number;
  xIsNext: boolean;
}

class Game extends React.Component<GameProps, GameState> {
  /* JavaScript のクラスでは、サブクラスのコンストラクタを定義する際は常に super を呼ぶ必要があります。
  constructor を持つ React のクラスコンポーネントでは、すべてコンストラクタを super(props) の呼び出しから始めるべきです。 */
  constructor(props: Readonly<GameProps>) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill("")
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    // スプレッド演算子でクローンを作る。
    const squaresCopy = [...current.squares];
    // ゲームの決着が既についている場合やクリックされたマス目が既に埋まっている場合に早期に return する。
    if (calculateWinner(squaresCopy) || squaresCopy[i]) return;

    squaresCopy[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squaresCopy
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (winner === "O" || winner === "X") {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// 勝敗判定
// 9 つの square の配列が与えられると、この関数は勝者がいるか適切に確認し、'X' か 'O'、あるいは null を返します。
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
