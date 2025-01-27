// useState: tic tac toe
// 💯 useLocalStorageState
// http://localhost:3000/isolated/final/04.extra-2.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({onClick, squares}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

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
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [history, setHistory] = useLocalStorageState(
    'history',
    [Array(9).fill(null)],
  )
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'currentSquares',
    history[history.length - 1],
  )
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return
    }
    const currentSquaresIndex = history.findIndex((element) => {
      return JSON.stringify(element) === JSON.stringify(currentSquares)
    })
    const historyCopy = history.slice(0, currentSquaresIndex + 1)    
    const currentSquaresCopy = [...currentSquares]

    currentSquaresCopy[square] = nextValue
    setCurrentSquares(currentSquaresCopy)
    setHistory([...historyCopy, currentSquaresCopy])
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentSquares(Array(9).fill(null))
  }

  function changeState(index) {
    setCurrentSquares(history[index])
  }

  const moves = history.map((step, index) => {
    const isCurrent = JSON.stringify(step) === JSON.stringify(currentSquares);
    const desc = index === 0 ? 'Go to game start' : `Go to move #${index}`;
    return (
     <li key={JSON.stringify(step)}>
        <button disabled={isCurrent} onClick={() => changeState(index)}>
          {desc} {isCurrent ? '(current)' : null}
        </button>
     </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
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
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
