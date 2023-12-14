import { useEffect, useState } from 'react';
import { Square, SquareValue } from "../Estilo";
import styles from './styles.module.css'

export type BoardState = SquareValue[];

export type BoardProps = {
  isXTurn: boolean,
  squares: BoardState,
  onPlay: (nextSquares: SquareValue[]) => void
};

export function Board({isXTurn, squares, onPlay}: BoardProps) {
  const [timeLeft, setTimeLeft] = useState(10);

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  const status = winner ? 
    `O vencedor é ${winner}!` :
    isDraw ?
    `Empate!` :
    `É a vez de ${isXTurn ? "X" : "O"}`;

  useEffect(() => {
    if (winner || isDraw) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [winner, isDraw, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      onPlay(Array(9).fill(null));
      setTimeLeft(10);
    }
  }, [timeLeft, onPlay]);

  function handleClick(i: number): void {
    if(squares[i] || winner) return;

    const newSquares = squares.slice();
    newSquares[i] = isXTurn ? "X" : "O";

    onPlay(newSquares);
  }

  let rows = [] as JSX.Element[];

  for(let i = 0; i < 3; i++){
    let cells = [] as JSX.Element[];
  
    for(let j = 0; j < 3; j++){
      let num = 3*i + j;
      
      cells.push(
        <Square
          key={num}
          value={squares[num]}
          onSquareClick={() => handleClick(num)}
        />
      );
    }

    rows.push(<div key={i} className={styles.boardrow}>{cells}</div>);
  }

  return(
    <div className={styles.card}>
      <h1>Jogo da Velha</h1>
      <span className={styles.username}>{status}</span>
      {(winner || isDraw) && <span>Reiniciando em {timeLeft} segundos...</span>}
      {rows}
    </div>
  );
}

function calculateWinner(squares: BoardState): SquareValue{
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

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default Board;
