import React, { useEffect, useState } from 'react';
import { Board, BoardState } from '../../components/Board';
import { socket } from '../../socket';

function Home() {

  const [socketInstance] = useState(socket());

  const [history, setHistory] = useState([Array(9).fill(null) as BoardState]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const handleClick = (nextSquares: BoardState) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
     return('')
  };

    useEffect(() => {
      socketInstance.on("board", (board) =>{
        console.log('jogada recebida', board)
      })
      return() =>{
        socketInstance.off("board");
      }
    }, [])
    
    const handle = (data: any) => {
      const newBoard = {
        board: data
      }
    }
  return (
    <div className="game">
      <div className="game-board">
        
        <Board isXTurn={isXTurn} squares={currentSquares} onPlay={handleClick} />
      </div>
      <div className="dados">
        
        </div>
        
      </div>
      
  )
}

export default Home;
