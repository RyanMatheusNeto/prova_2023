import React, { useEffect, useState } from 'react';
import { Board, BoardState } from '../../components/Board';
import { socket } from '../../socket';
import { Square } from '../../components/Estilo';

export interface IBoard {
  board: boolean,
  isOwner?: boolean
}

function Home() {

  const [socketInstance] = useState(socket());

  const [history, setHistory] = useState([Array(9).fill(null) as BoardState]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXTurn = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const [boards, setBoards] = useState<IBoard[]>([])



  const handleClick = (nextSquares: BoardState) => {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
     return('')
  };

    useEffect(() => {
      socketInstance.on("board", (board) =>{
        setBoards((prev) =>[... prev, board])
      })
      return() =>{
        socketInstance.off("board");
      }
    }, [])


    //quando for criar  receber vai ser o valor board[num]
    const handle = (data: any) => {
      const newBoard = {
        board: data
      }
      
      socketInstance.emit('board', newBoard)
      setBoards(prev => [
        ... prev,
        {... newBoard, isOwner: true}
      ])
    }
    const handleAndClick = (nextSquares: BoardState) => {
      handleClick(nextSquares);
      handle(nextSquares);

  }

  
  return (
    <div className="game">
      <div className="game-board">
        
        <Board isXTurn={isXTurn} squares={currentSquares} onPlay={handleAndClick} />
      </div>
      <div className="dados">
        
        </div>
        
      </div>
      
  )
}

export default Home;
