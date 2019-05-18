import React from 'react';
import * as cl from 'classnames';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
      <Game />
    </div>
  );
}

export default App;

function Square(props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardRow = [];
    for (let i = 0; i < 3; i++) {
      let square = [];
      for (let j = 0; j < 3; j++) {
        square.push(this.renderSquare(3 * i + j));
      }
      boardRow.push(
        <div className='board-row' key={i}>
          {square}
        </div>
      );
    }
    return <div>{boardRow}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          position: undefined // 鼠标点击的位置
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      movesSort: false
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
          position: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  toggleMovesSort() {
    this.setState({
      movesSort: !this.state.movesSort
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const movesHistory = history.slice();
    if (!this.state.movesSort) {
      // movesHistory不变
    } else {
      movesHistory.reverse();
    }

    const moves = movesHistory.map((step, move) => {
      const targetStep = !this.state.movesSort
        ? move
        : movesHistory.length - move - 1;
      const desc = targetStep
        ? 'Go to move #' +
          targetStep +
          '列号:' +
          (step.position % 3) +
          '行号:' +
          Math.floor(step.position / 3)
        : 'Go to game start';
      return (
        <li key={move}>
          <button
            className={cl({
              bold: this.state.stepNumber === targetStep
            })}
            onClick={() => this.jumpTo(targetStep)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className='game'>
        <div className='game-board'>
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <button onClick={() => this.toggleMovesSort()}>
            {`${
              !this.state.movesSort
                ? 'sort moves: ascend'
                : 'sort moves: descend'
            }`}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
  return null;
}
