import React, { useState } from 'react';
import { Board, BoardState } from '../../components/Board';

function Home() {
  const [history, setHistory] = useState([Array(9).fill(null) as BoardState]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [player1, setPlayer1] = useState('Jogador 1');
  const [player2, setPlayer2] = useState('Jogador 2');

  const handleClick = (nextSquares: BoardState) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  };

  return (
    <div className="game">
      <div className="game-board">
        
        <Board isXTurn={isXTurn} squares={currentSquares} onPlay={handleClick}/>
      </div>
      <div className="dados">
        
        </div>
        
      </div>
      
  )
}

export default Home;
