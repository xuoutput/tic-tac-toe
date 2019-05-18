This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

启动

## 恭喜你！你已经完成了一个拥有以下功能的井字棋啦：

1. tic-tac-toe(三连棋)游戏的所有功能
2. 能够判定玩家何时获胜
3. 能够记录游戏进程
4. 允许玩家查看游戏的历史记录，也可以查看任意一个历史版本的游戏棋盘状态

在这里可以查看最终的游戏代码:[最终成果](https://codepen.io/gaearon/pen/gWWZgR?editors=0010).
v
如果你还有充裕的时间，或者想练习一下刚刚学会的 React 新技能，这里有一些可以改进游戏的想法供你参考，这些功能的实现顺序的难度是递增的：

- [x] 1. 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。
- [x] 2. 在历史记录列表中加粗显示当前选择的项目。
- [x] 3. 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。
- [x] 4. 添加一个可以升序或降序显示历史记录的按钮。
- [ ] 5. 每当有人获胜时，高亮显示连成一线的 3 颗棋子。
- [ ] 6. 当无人获胜时，显示一个平局的消息。

### 1. 在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。

既然在 `<Game></Game>` 组件的 `state.history` 中记录了每一步的历史信息, 那么我们可以在这里添加上每步点击的坐标是哪里, 然后就可以计算出 `(列号, 行号)`

在 `handleClick(i)` 方法中传入的 `i` 就是坐标, 每次点击的时候将他保存.

```javascript
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
      xIsNext: true
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
          position: i         // 同时在鼠标点击的时候保存当前坐标的值
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
```

最后在 `render` 函数中, 通过 [map](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 来得到历史中保存在 `position` 信息, 然后就可以计算出 **列号和行号**

```javascript
const moves = history.map((step, move) => {
  const desc = move
    ? 'Go to move #' +
      move +
      '列号:' +
      (step.position % 3) +
      '行号:' +
      Math.floor(step.position / 3)
    : 'Go to game start';
  return (
    <li key={move}>
      <button onClick={() => this.jumpTo(move)}>{desc}</button>
    </li>
  );
});
```

### 2. 在历史记录列表中加粗显示当前选择的项目。

这个问题主要在于解决 `map` 中的代表在 `history` 中每一步的 `move` 值, 和代表当前第几步的 `stepNumber` 的比较.

1. 字体加粗的方法可以用 `<b></b>` 来实现
2. 使用 [classnames](https://www.npmjs.com/package/classnames) 来设置样式 (推荐)

#### 用`<b>`

```javascript
// 使用 <b>
const moves = history.map((step, move) => {
  let desc = '';
  if (!move) {
    desc = 'Go to game start';
  } else {
    if (this.state.stepNumber === move) {
      desc = (
        <b>
          {'Go to move #' +
            move +
            '列号:' +
            (step.position % 3) +
            '行号:' +
            Math.floor(step.position / 3)}
        </b>
      );
    } else {
      desc =
        'Go to move #' +
        move +
        '列号:' +
        (step.position % 3) +
        '行号:' +
        Math.floor(step.position / 3);
    }
  }
  return (
    <li key={move}>
      <button onClick={() => this.jumpTo(move)}>{desc}</button>
    </li>
  );
});
```

#### 用 classnames 这个包来设置样式

先用 `npm i -D classnames` 安装依赖

```javascript
// classnames
import * as cl from 'classnames';

// ...

return (
  <li key={move}>
    <button
      className={cl({
        bold: this.state.stepNumber === move
      })}
      onClick={() => this.jumpTo(move)}
    >
      {desc}
    </button>
  </li>
);
```

App.css 文件中加入样式

```css
.bold {
  font-weight: bold;
}
```

### 3. 使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。

这里说的是 `<Board>` 组件中 `render` 使用循环, 说到循环:

- while
- do...while
- for
- forEach
- for...in
- for...of

当然还有对 [Array](https://xuoutput.github.io/2019/05/12/javascript-%E6%95%B0%E7%BB%84/) 进行操作的比如:

- every
- some
- map
- filter
- reduce
- push
- pop
- shift
- unshift

这里用的是使用数组, [列表 & Key](https://react.docschina.org/docs/lists-and-keys.html) 但不使用 `map`, 因为 `map` 是对数组中的每一个值进行操作.

`key` 记得要在两边都添加, 因为两边都使用了循环.

```javascript
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i} // 增加了key
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
```

### 4. 添加一个可以升序或降序显示历史记录的按钮。

这次要做的功能考虑的方面有点多.

要显示倒叙, 就是对 `moves` 进行处理, 即 对 `history.map()` 处理, 这里 `map` 并没有升降序的功能, 所以只能对 `history` 进行处理.

对数组进行升降序有 `reverse()` 方法可以使用.

1. 增加一个 `this.state.movesSort` 用来切换升降序.
2. 设置一个新的变量 `movesHistory` 是对 `history` 的一个副本, 用这个来进行 `reverse`, 因为原来的 `history` 还是用来判断 winner 的.
3. 历史记录的 `desc` 在默认升序下不需要改动, 在进行 `toggle` 降序后, 则需要对列表进行切换, `'Go to move #'` 的数字也要降序
4. 点击按钮回到历史中, 以及选中的当前项目加粗同样需要重新计算

关键代码

```javascript
// state中增加
movesSort: false    // 排序

// render中
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


// toggle方法
toggleMovesSort() {
  this.setState({
    movesSort: !this.state.movesSort
  });
}
```
