/* 参考先　https://note.com/tkugimot/n/nf7fe751298b1 */
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";

// TypeScriptはプロパティの定義にInterfaceが必要
interface SquarePropsInterface {
  value: string;
  onClick: () => void;
}

// 関数コンポーネントは、render メソッドだけを有して自分の state を持たないコンポーネントを、よりシンプルに書くための方法
const Square = (props: SquarePropsInterface) => {
  return (
    // 関数コンポーネントは引数からpropsを受け取るのでthisが要らない
    // onClick={props.onClick}でもよい
    // buttonタグのonClick属性は特別な意味を持つ
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
};
interface BoardPropsInterface {
  squares: Array<string>;
}

interface BoardStateInterface {
  squares: Array<string>;
}

class Board extends React.Component<BoardPropsInterface, BoardStateInterface> {
  /* JavaScript のクラスでは、サブクラスのコンストラクタを定義する際は常に super を呼ぶ必要があります。constructor を持つ React のクラスコンポーネントでは、すべてコンストラクタを super(props) の呼び出しから始めるべきです。 */
  constructor(props: BoardPropsInterface) {
    super(props);
    this.state = {
      squares: Array(9).fill(""),
      xIsNext: true
    };
  }

  handleClick(i: number) {
    // 引数なしのslice()で別のオブジェクトを作り、immutableにする
    const squares: Array<string> = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext
    });
  }

  renderSquare(i: number) {
    return (
      // コンポーネントタグのonClickはReactにおける予約語ではない
      // イベントを表すpropsにはon[Event]、イベントを処理するメソッドにはhandle[Event]が名付けられる慣習
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner === "O" || winner === "X") {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div>
        <div className="status">{status}</div>
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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// 勝敗判定
// 9 つの square の配列が与えられると、この関数は勝者がいるか適切に確認し、'X' か 'O'、あるいは null を返します。
function calculateWinner(squares: Array<string>): string {
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
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// import * as React from "react";
// import { render } from "react-dom";

// import App from "./App";

// const rootElement = document.getElementById("root");
// render(<App />, rootElement);
